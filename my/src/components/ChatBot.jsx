// // components/RealTimeChatBot.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import { MessageCircle, Send, X, Phone, ShoppingBag } from 'lucide-react';

// const API_URL = import.meta.env.VITE_API_URL;

// const RealTimeChatBot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [sessionId] = useState(() => 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
//   const messagesEndRef = useRef(null);
//   const pollInterval = useRef(null);

//   // Auto-scroll
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Fetch messages (long polling fallback)
//   const fetchMessages = async () => {
//     try {
//       const res = await fetch(`${API_URL}/api/chat/${sessionId}`);
//       if (res.ok) {
//         const data = await res.json();
//         setMessages(data.messages || []);
//       }
//     } catch (err) {
//       console.log('Chat fetch failed (normal on first load)');
//     }
//   };

//   // Start polling when chat opens
//   useEffect(() => {
//     if (!isOpen) return;

//     fetchMessages(); // Initial load

//     pollInterval.current = setInterval(() => {
//       fetchMessages();
//     }, 3000); // Every 3 seconds (adjust as needed)

//     return () => {
//       if (pollInterval.current) clearInterval(pollInterval.current);
//     };
//   }, [isOpen, sessionId]);

//   // Send message
//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const text = input.trim();
//     setInput('');

//     // Optimistically add to UI
//     setMessages(prev => [...prev, {
//       id: Date.now(),
//       text,
//       sender: 'customer',
//       timestamp: new Date().toISOString()
//     }]);

//     try {
//       await fetch(`${API_URL}/api/chat`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           sessionId,
//           message: text,
//           sender: 'customer'
//         })
//       });
//     } catch (err) {
//       alert('Message failed. Try again.');
//     }
//   };

//   return (
//     <>
//       {/* Floating Button */}
//       <button
//         onClick={() => setIsOpen(true)}
//         className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 animate-pulse"
//       >
//         <MessageCircle className="w-8 h-8" />
//         <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
//         <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"></span>
//       </button>

//       {/* Chat Window */}
//       {isOpen && (
//         <>
//           <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setIsOpen(false)} />

//           <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[95vw] h-[600px] bg-white rounded-3xl shadow-3xl overflow-hidden border border-gray-200 flex flex-col">
//             {/* Header */}
//             <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white p-5">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="relative">
//                     <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
//                       <ShoppingBag className="w-7 h-7" />
//                     </div>
//                     <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-lg">Dilkhush Kirana</h3>
//                     <p className="text-sm opacity-90">We are online</p>
//                   </div>
//                 </div>
//                 <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full">
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>

//             {/* Messages */}
//             <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-amber-50/30 to-white">
//               {messages.length === 0 && (
//                 <div className="text-center py-12">
//                   <p className="text-xl text-gray-700 font-medium mb-2">Namaste!</p>
//                   <p className="text-gray-600">How can we help you today?</p>
//                 </div>
//               )}

//               {messages.map((msg) => (
//                 <div
//                   key={msg.id}
//                   className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
//                 >
//                   <div
//                     className={`max-w-[80%] px-5 py-3 rounded-2xl shadow-sm ${
//                       msg.sender === 'customer'
//                         ? 'bg-emerald-600 text-white'
//                         : 'bg-white border border-gray-200 text-gray-800'
//                     }`}
//                   >
//                     <p className="text-sm leading-relaxed">{msg.text}</p>
//                     <p className="text-xs opacity-70 mt-1">
//                       {new Date(msg.timestamp).toLocaleTimeString('en-IN', {
//                         hour: 'numeric',
//                         minute: '2-digit'
//                       })}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Quick Actions */}
//             {messages.length === 0 && (
//               <div className="px-6 pb-4">
//                 <div className="grid grid-cols-2 gap-3">
//                   <a href="/products" className="bg-white border-2 border-emerald-200 text-emerald-700 font-medium text-sm py-3 rounded-xl text-center hover:bg-emerald-50 transition-all">
//                     View Products
//                   </a>
//                   <a href="https://wa.me/919723089786" target="_blank" className="bg-green-600 text-white font-medium text-sm py-3 rounded-xl text-center hover:bg-green-700 transition-all">
//                     WhatsApp Us
//                   </a>
//                 </div>
//               </div>
//             )}  

//             {/* Input */}
//             <div className="border-t border-gray-200 p-4 bg-white">
//               <div className="flex gap-3">
//                 <input
//                   type="text"
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
//                   placeholder="Write a message..."
//                   className="flex-1 px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-sm"
//                 />
//                 <button
//                   onClick={sendMessage}
//                   className="w-12 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
//                 >
//                   <Send className="w-5 h-5" />
//                 </button>
//               </div>
//               <p className="text-xs text-center text-gray-500 mt-3">
//                 Messages are private • 9 AM – 9 PM
//               </p>
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default RealTimeChatBot;
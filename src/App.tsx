import React, { useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

function App() {
	const [username, setUsername] = useState('');
	const [roomId, setRoomId] = useState('');
	const [value, setValue] = useState('');

	const [messages, setMessages] = useState<any[]>([]);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const socketRef = useRef<Socket>();

	console.log(messages);

	const connect = () => {
		socketRef.current = io('http://localhost:7878');
		socketRef.current?.emit('ROOM:join', {
			roomId,
			username,
		});
		setIsConnected(true);

		socketRef.current?.on('ROOM:get_message', (data) => {
			console.log(data);
			setMessages((prev) => {
				return [
					...prev,
					{
						type: 'message',
						username: data.username,
						message: data.message,
					},
				];
			});
		});

		socketRef.current?.on('ROOM:user_connected', (data) => {
			console.log(data);
			setMessages((prev) => {
				return [
					...prev,
					{
						type: 'connection',
						username: data.username,
					},
				];
			});
		});
	};

	const sendMessage = () => {
		socketRef.current?.emit('ROOM:send_message', {
			roomId,
			username,
			message: value,
		});
	};

	return (
		<div className="App">
			<header className="App-header">{username}</header>
			{!isConnected ? (
				<>
					<label>
						roomid
						<input value={roomId} onChange={(e) => setRoomId(e.target.value)} />
					</label>
					<label>
						username
						<input value={username} onChange={(e) => setUsername(e.target.value)} />
					</label>
					<button onClick={connect}>connect</button>
				</>
			) : (
				<>
					<input value={value} onChange={(e) => setValue(e.target.value)} />
					<button onClick={sendMessage}>отправить</button>
				</>
			)}
			<div>
				{messages.map((msg, index) =>
					msg.type === 'connection' ? (
						<div key={msg.type + msg.username + index} style={{ color: '#777' }}>
							{msg.username} подключился
						</div>
					) : (
						<div key={msg.type + msg.username + index}>
							{msg.username}: {msg.message}
						</div>
					),
				)}
			</div>
		</div>
	);
}

export default App;

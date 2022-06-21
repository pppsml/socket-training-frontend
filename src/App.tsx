import React, { useRef, useState } from 'react';

function App() {
	const [userName, setUserName] = useState('');
	const [value, setValue] = useState('');
	const [messages, setMessages] = useState<any[]>([]);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const socket = useRef<WebSocket>();

	const connect = () => {
		socket.current = new WebSocket('ws://localhost:7878');
		const ws = socket.current;

		ws.onopen = () => {
			setIsConnected(true);
			const message = {
				event: 'connection',
				userName,
				id: Date.now(),
			};
			ws.send(JSON.stringify(message));
			console.log('ws connected');
		};
		ws.onmessage = (event) => {
			const message = JSON.parse(event.data);
			setMessages((prev) => [message, ...prev]);
		};
		ws.onclose = () => {
			console.log('Socket закрыт');
		};
		ws.onerror = () => {
			console.log('Socket ошибка');
		};
	};

	const sendMessage = () => {
		const message = {
			userName,
			message: value,
			event: 'message',
			id: Date.now(),
		};
		socket.current?.send(JSON.stringify(message));
		setValue('');
	};

	return (
		<div className="App">
			<header className="App-header">{userName}</header>
			{!isConnected ? (
				<>
					<input value={userName} onChange={(e) => setUserName(e.target.value)} />
					<button onClick={connect}>connect</button>
				</>
			) : (
				<>
					<input value={value} onChange={(e) => setValue(e.target.value)} />
					<button onClick={sendMessage}>отправить</button>
				</>
			)}
			<div>
				{messages.map((msg) =>
					msg.event === 'connection' ? (
						<div key={msg.id}>{msg.userName} подключился</div>
					) : (
						<div key={msg.id}>
							{msg.userName}: {msg.message}
						</div>
					),
				)}
			</div>
		</div>
	);
}

export default App;

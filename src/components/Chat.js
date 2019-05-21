import React, {useState, useEffect} from 'react';
import MDSpinner from 'react-md-spinner';
import { CometChat } from '@cometchat-pro/chat';

const MESSAGE_LISTENER_KEY = 'listener-key';
const limit = 30;

const Chat = ({user}) => {
    const [friends, setFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState(null);
    const [chat, setChat] = useState([]);
    const [chatIsLoading, setChatIsLoading] = useState(false);
    const [friendIsLoading, setFriendIsLoading] = useState(true);
    const [message, setMessage] = useState('');
    
    // useEffect fetches all users available to chat
    // calling wiht an empty array means useEffect will only be called on mount
    useEffect(() => {
        let usersRequest = new CometChat.UsersRequestBuilder()
            .setLimit(limit)
            .build();
        usersRequest.fetchNext()
            .then(
                userList => {
                    console.log('User list received', userList);
                    setFreinds(userList);
                    setFriendsIsLoading(false);
                },
                error => {
                    console.log('User list fetching failed with error:', error);
                }
            );

            return () => {
                CometChat.removeMessageListener(MESSAGE_LISTENER_KEY);
                CometChat.logout();
            }
    }, []);
    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-md-2' />
                <div className='col-md-8 h-100pr border rounded'>
                    <div className='row'>
                        <div className='col-lg-4 col-xs-12 bg-light' style={{height:658}}>
                            <div className='row p-3'>
                                <h2>Friend List</h2>
                            </div>
                            <div
                                className='row ml-0 mr-0 h-75 bg-white border rounded'
                                style={{height: '100%', overflow: 'auto'}}>
                            <FriendsList
                                friends={friends}
                                friendsIsLoading={friendsIsLoading}
                                selectedFriend={selectedFriend}
                                selectFriend={selectFriend}
                            />    
                            </div>
                        </div>
                        <div className='col=lg-8 col-xs-12 bg-light' style={{height: 658}}>
                            <div className='row p-3 bg-white'>
                                <h2>Who to chat with?</h2>
                            </div>
                            <div
                                className='row pt-5 bg-white'
                                style={{height: 530, overflow: 'auto'}}>
                                <ChatBox
                                    chat={chat}
                                    chatIsLoading={chatIsLoading}
                                    user={user}
                                />
                            </div>
                            <div className='row bg-light' style={{bottom: 0, width: '100%'}}>
                                <form className='row m-0 p-0 w-100' onSubmit={handleSubmit}>
                                    <div className='col-9 m-0 p-1'>
                                        <input
                                            id='text'
                                            className='mw-100 border rounded form-control'
                                            type='text'
                                            onChange={event => {
                                                setMessage(event.target.value);
                                            }}
                                            value={message}
                                            placeholder='Type your message...'
                                        />
                                    </div>
                                    <div className='col-3 m-0 p-1'>
                                        <button
                                            className='btn btn-outline-secondary rounded border w-100'
                                            title='Send'
                                            style={{paddingRight: 16}}>
                                            Send
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ChatBox = props => {
    const { chat, chatIsLoading, user } = props;
    if (chatIsLoading) {
        return (
            <div className='col-xl-12 my-auto text-center'>
                <MDSpinner size='72' />
            </div>
        );
    } else {
        return (
            <div className='col-xl-12'>
                {chat.map(chat => (
                    <div key={chat.id} className='message'>
                        <div className={`${chat.receiver !== user.uid ? 'balon1' : 'balon2'} p-3 m-1`}>
                            {chat.text}
                        </div>
                    </div>
                ))}
                <div id='ChartBoxEnd'/>
            </div>
        );
    }
};

const FriendList = props => {
    const { friends, friendsIsLoading, selectedFriend } = props;
    if (friendIsLoading) {
        return (
            <div>
                <MDSpinner size='72' />
            </div>
        );
    } else {
        return (
            <ul className='list-group list-group-flush w-100'>
                {friends.map(freind => (
                    <li>
                        key={friend.uid}
                        className={`list-group-item ${
                            friend.uid === selectedFriend ? 'active' : ''
                        }`}
                        onClick={() => props.selectFriend(friend.uid)}>
                        {friend.name}
                    </li>
                ))}

            </ul>
        )
    }
}

export default Chat;
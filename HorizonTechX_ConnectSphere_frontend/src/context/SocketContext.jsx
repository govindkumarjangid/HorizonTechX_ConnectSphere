import React from 'react';
import useSocketStore from '../store/useSocketStore';

export const SocketProvider = ({ children }) => <>{children}</>;

export const useSocket = () => useSocketStore();

export default SocketProvider;

import { useWalletConnection } from '../hooks/useWalletConnection';

export const Receive = () => {
  const { address } = useWalletConnection();

  return (
    <div>
      Receive
      <div>Address: {address}</div>
      {/* TODO: QR */}
    </div>
  );
};

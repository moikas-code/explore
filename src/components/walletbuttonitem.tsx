
function WalletButtonItem({
  text = '',
  onPress = () => {
    console.log('connecting...');
  },
  walletItemStyle = '',
}:{text:string, onPress:() => void, walletItemStyle?:string}) {
  return (
    <div
      className={`wallet-button-item d-flex flex-row justify-content-start border-start border-bottom border-dark cursor-point ps-2 me-1 ${walletItemStyle}`}
      onClick={() => onPress()}
    >
      {text}
    </div>
  );
}
export default WalletButtonItem;

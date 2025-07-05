import { useMachine } from '@xstate/react';
import { choicesMachine } from '../machines/choicesMachine.js';
import FourCardGrid from '../../root/components/FourCardGrid';
import CardButton from '../../root/components/CardButton';

export default function ChoicesGrid(props) {
  const [state, send] = useMachine(choicesMachine);
  const { username, email, password } = state.context;
  const signupFieldsFilled = username && email && password;

  // 「状態ごとにカードセットを生成」
  let cards = [];
  if (state.matches('unauth')) {
    cards = [
      { id: 'quest1', title: 'Quest', description: 'サンプル・クエスト', card_type: 'quest' },
      { id: 'mission1', title: 'Mission', description: 'サンプル・ミッション', card_type: 'mission' },
      { id: 'login', title: 'Login', description: 'アカウントがある方はこちら', card_type: 'auth_login' },
      { id: 'signup', title: 'Sign Up', description: '今すぐ無料スタート！', card_type: 'auth_signup' } 
    ]; // 未ログインのときのカード4枚
  }
  if (state.matches('signup')) {
    cards = [
      { id: 'username', title: 'Name', description: '好きな名前を入力', card_type: 'username' },
      { id: 'email', title: 'Mail Address', description: 'ご連絡用メール', card_type: 'email' },
      { id: 'password', title: 'Password', description: '8文字以上', card_type: 'password' },
      signupFieldsFilled
        ? { id: 'submit', title: 'Submit', description: '全て入力して登録', card_type: 'submit' }
        : { id: 'login', title: 'or Login', description: 'アカウントをお持ちの方', card_type: 'login' }
    ]; // サインアップ時のカード4枚
  }
  if (state.matches('main')) {
    // cards = [ ... ]; // ログイン済みのときのカード4枚
  }

  // どのカードがクリックされたときどう動くかもここで
  const handleCardClick = (card) => {
    if (card.card_type === 'auth_login') send({ type: 'LOGIN' });
    if (card.card_type === 'auth_signup') send({ type: 'SIGNUP' });
    // ...他も同様
  };

  // 「描画」はFourCardGridに全て任せる
  return (
    <FourCardGrid
      cards={cards}
      renderCard={(card, idx) => (
        <CardButton
          key={card.id}
          card={card}
          onClick={() => handleCardClick(card)}
        />
      )}
    />
  );
}

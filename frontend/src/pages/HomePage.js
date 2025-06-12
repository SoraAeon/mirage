import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => (
  <div>
    <h1>Welcome to RealPG!</h1>
    <ul>
      <li><Link to="/village">開発者の村</Link></li>
      <li><Link to="/quests">人生ツリー</Link></li>
    </ul>
  </div>
);
export default HomePage;

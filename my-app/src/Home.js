import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>本地生活</h1>
      <div>
        <h2>餐饮</h2>
        <ul>
          <li><Link to="/discover">餐厅</Link></li>
          <li><Link to="/discover">快餐店</Link></li>
          <li><Link to="/discover">咖啡厅</Link></li>
          <li><Link to="/discover">酒吧</Link></li>
        </ul>
      </div>
      <div>
        <h2>购物</h2>
        <ul>
          <li><Link to="/discover">超市</Link></li>
          <li><Link to="/discover">商场</Link></li>
          <li><Link to="/discover">便利店</Link></li>
          <li><Link to="/discover">农贸市场</Link></li>
        </ul>
      </div>
      <div>
        <h2>娱乐</h2>
        <ul>
          <li><Link to="/discover">电影院</Link></li>
          <li><Link to="/discover">游戏厅</Link></li>
          <li><Link to="/discover">KTV</Link></li>
          <li><Link to="/discover">运动场馆</Link></li>
        </ul>
      </div>
      <div>
        <h2>生活服务</h2>
        <ul>
          <li><Link to="/discover">银行</Link></li>
          <li><Link to="/discover">邮局</Link></li>
          <li><Link to="/discover">医院</Link></li>
          <li><Link to="/discover">美容美发</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
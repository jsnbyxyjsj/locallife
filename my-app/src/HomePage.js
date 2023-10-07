import React, { useState, useEffect } from 'react';
import { Card } from 'your-card-library';
import { useMediaQuery } from 'react-responsive';
import { animateCSS } from 'your-css-animation-library';
import axios from 'axios';
// 导入按钮组件
import { Button } from '@leafer/ui';

// 创建按钮实例
const button = new Button({
  text: '按钮',
});

// 渲染按钮
button.render();

// 添加按钮点击事件处理程序
button.onClick(() => {
  // 在按钮被点击时执行的操作
  wx.showToast({
    title: '按钮被点击了',
    icon: 'none',
  });
});

export const Home = () => 
  const [cards, setCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const handleSearch = () => {
    // 根据实际需求，将搜索词与数据进行匹配，并更新显示的卡片数据
    const filteredCards = cards.filter(card => card.title.includes(searchTerm));
    setCards(filteredCards);
  };

  const handleMouseEnter = (index) => {
    // 添加鼠标悬停效果，如改变背景颜色或添加阴影效果
    animateCSS(`card-${index}`, 'bounce');
  };

  const handleMouseLeave = (index) => {
    // 移除鼠标悬停效果
    animateCSS(`card-${index}`, 'bounce', true);
  };

  useEffect(() => {
    // 获取卡片数据
    const apiUrl = 'https://your-api-url';
    axios.get(apiUrl).then((response) => {
      setCards(response.data);
    });
  }, []);

  return (
    <div>
      <h1>本地生活</h1>
      <div>
        <h2>餐饮</h2>
        <ul>
          <li>餐厅</li>
          <li>快餐店</li>
          <li>咖啡厅</li>
          <li>酒吧</li>
        </ul>
      </div>
      <div>
        <h2>购物</h2>
        <ul>
          <li>超市</li>
          <li>商场</li>
          <li>便利店</li>
          <li>农贸市场</li>
        </ul>
      </div>
      <div>
        <h2>娱乐</h2>
        <ul>
          <li>电影院</li>
          <li>游戏厅</li>
          <li>KTV</li>
          <li>运动场馆</li>
        </ul>
      </div>
      <div>
        <h2>生活服务</h2>
        <ul>
          <li>银行</li>
          <li>邮局</li>
          <li>医院</li>
          <li>美容美发</li>
        </ul>
      </div>
      {isMobile ? (
        // 使用 react-responsive 库实现分类搜索的响应式设计
        <div>
          {/* 分类搜索或按钮列表 */}
        </div>
      ) : (
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onBlur={handleSearch}
          placeholder="Search" />
      )}

      <div>
        {cards.map((card, index) => (
          <Card
            key={card.id}
            id={`card-${index}`}
            title={card.title}
            width={isMobile ? '100%' : '30%'}
            height="200px"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)} />
        ))}
      </div>
    </div>
  );
import axios from 'axios';

export const Home = () => {
  const [cards, setCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const handleSearch = () => {
    // 根据实际需求，将搜索词与数据进行匹配，并更新显示的卡片数据
    const filteredCards = cards.filter(card => card.title.includes(searchTerm));
    setCards(filteredCards);
  };

  const handleMouseEnter = (index) => {
    // 添加鼠标悬停效果，如改变背景颜色或添加阴影效果
    animateCSS(`card-${index}`, 'bounce');
  };

  const handleMouseLeave = (index) => {
    // 移除鼠标悬停效果
    animateCSS(`card-${index}`, 'bounce', true);
  };

  useEffect(() => {
    // 获取卡片数据
    const apiUrl = 'https://your-api-url';
    axios.get(apiUrl).then((response) => {
      setCards(response.data);
    });
  }, []);

  return (
    <div>
      <h1>本地生活</h1>
      <div>
        <h2>餐饮</h2>
        <ul>
          <li>餐厅</li>
          <li>快餐店</li>
          <li>咖啡厅</li>
          <li>酒吧</li>
        </ul>
      </div>
      <div>
        <h2>购物</h2>
        <ul>
          <li>超市</li>
          <li>商场</li>
          <li>便利店</li>
          <li>农贸市场</li>
        </ul>
      </div>
      <div>
        <h2>娱乐</h2>
        <ul>
          <li>电影院</li>
          <li>游戏厅</li>
          <li>KTV</li>
          <li>运动场馆</li>
        </ul>
      </div>
      <div>
        <h2>生活服务</h2>
        <ul>
          <li>银行</li>
          <li>邮局</li>
          <li>医院</li>
          <li>美容美发</li>
        </ul>
      </div>
      {isMobile ? (
        // 使用 react-responsive 库实现分类搜索的响应式设计
        <div>
          {/* 分类搜索或按钮列表 */}
        </div>
      ) : (
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onBlur={handleSearch}
          placeholder="Search" />
      )}

      <div>
        {cards.map((card, index) => (
          <Card
            key={card.id}
            id={`card-${index}`}
            title={card.title}
            width={isMobile ? '100%' : '30%'}
            height="200px"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)} />
        ))}
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Card } from 'your-card-library';
import { useMediaQuery } from 'react-responsive';
import { animateCSS } from 'your-css-animation-library';
import { Axios } from 'axios';

export const Home = () => {
  const [cards, setCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const handleSearch = () => {
    const filteredCards = cards.filter(card => card.title.includes(searchTerm));
    setCards(filteredCards);
  };

  const handleMouseEnter = (index) => {
    animateCSS(`card-${index}`, 'bounce');
  };

  const handleMouseLeave = (index) => {
    animateCSS(`card-${index}`, 'bounce', true);
  };

  useEffect(() => {
    const apiUrl = 'https://your-api-url';
    Axios.get(apiUrl).then((response) => {
      setCards(response.data);
    });
  }, []);

  return (
    <div>
      <h1>本地生活</h1>

      <section>
        <h2>餐饮</h2>
        <ul>
          <li>餐厅</li>
          <li>快餐店</li>
          <li>咖啡厅</li>
          <li>酒吧</li>
        </ul>
      </section>

      <section>
        <h2>购物</h2>
        <ul>
          <li>超市</li>
          <li>商场</li>
          <li>便利店</li>
          <li>农贸市场</li>
        </ul>
      </section>

      <section>
        <h2>娱乐</h2>
        <ul>
          <li>电影院</li>
          <li>游戏厅</li>
          <li>KTV</li>
          <li>运动场馆</li>
        </ul>
      </section>

      <section>
        <h2>生活服务</h2>
        <ul>
          <li>银行</li>
          <li>邮局</li>
          <li>医院</li>
          <li>美容美发</li>
        </ul>
      </section>

      {isMobile ? (
        <div>
          {/* 分类搜索或按钮列表 */}
        </div>
      ) : (
        <input
          type="text
import React, { createElement, useEffect, useState } from 'react'

import { Select } from '@alifd/next'

import './index.scss';


const TextureSetter = (props) => {
  const { value, onChange } = props;

  const [ currentTexture, setCurrentTexture ] = useState(value);
  const [ dataSource, setDataSource ] = useState([])

  useEffect(() => {
    const fetchTextures = async () => {
      const response = await fetch('https://i.ablula.tech/textures/textures.json');
      const textureList = await response.json()
      setDataSource(textureList)
    };
    fetchTextures();
  }, []);

  return <div className="texture-setter-container">
    <div className="select-container">
      <Select dataSource={dataSource || []} onChange={(selected) => {
        onChange?.(selected)
        setCurrentTexture(selected);
      }}/>
    </div>
    <div>
      { currentTexture ? <img className="preview-img" src={currentTexture} /> : null }
    </div>
  </div>;
}

export default TextureSetter;
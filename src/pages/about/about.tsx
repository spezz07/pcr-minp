import React from "react";
import { View, Text } from "@tarojs/components";


import "./about.scss";


const About = () => {
    return (
      <View className='v-container'>
        <View>
          <Text>V0.1-初版</Text>
          <View>
            <Text>
              本小程序目的是用于记录常用阵容，如需进行更详细的查询可前往
            </Text>
            <Text>https://www.pcrdfans.com/battle</Text>
          </View>
        </View>
      </View>
    );
};

export default About;

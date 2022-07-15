import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'
import { Button } from 'react-native-elements';

const ButtonList = (props) => {
  const {icon,title,color,onPress,heightBtn, typeIcon} = props;
  let btnColor = color
  let btnHeight = heightBtn

  const iconGeneral = {
    name: icon,
    type: typeIcon,
    size: 20,
    color: "#b5b3b3",
  };

  return (
    <View style={styles.button}>
      <Button 
        TouchableComponent={TouchableOpacity}
        title={title.trim()} 
        titleStyle={{...styles.titleBtn, color: btnColor === undefined ? "#000" : "#FFF"}} 
        buttonStyle={{...styles.buttonStyle, 
            backgroundColor: btnColor === undefined ? "rgba(230, 230, 230, 0.3)" : btnColor,
            height: btnHeight === undefined ? 60 : btnHeight 
        }} 
        icon={iconGeneral} 
        iconContainerStyle={{...styles.iconContainer, color: btnColor === undefined ? "#000" : "#FFF"}}
        onPress={onPress}
      />
    </View>
  )
}

export default ButtonList

const styles = StyleSheet.create({
  button:{
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
  },
  buttonStyle: {
    width: "100%",
    display: 'flex',
    justifyContent: "flex-start",
    borderRadius: 10,
  },
  titleBtn: { 
    margin: 10,
  },
})
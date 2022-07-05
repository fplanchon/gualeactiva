import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ButtonList from "../../../componentes/home/ButtonList"

const TasasHome = () => {
  return (
    <View>
      <ButtonList typeIcon="material-community" icon="view-module-outline" title="Tasa Gral. Inmobiliaria (TGI)" heightBtn={80}/>
      <ButtonList typeIcon="material-community" icon="view-module-outline" title="Tasa Cementerio" heightBtn={80}/>
      <ButtonList typeIcon="material-community" icon="view-module-outline" title="Tasa de Comercio (TISHyP)" heightBtn={80}/>
      <ButtonList typeIcon="material-community" icon="view-module-outline" title="Deudas" heightBtn={80}/>
    </View>
  )
}

export default TasasHome

const styles = StyleSheet.create({})
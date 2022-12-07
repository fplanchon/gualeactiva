import { StyleSheet, Text, View, Modal } from 'react-native'
import React, { useState } from 'react'
import { Icon } from 'react-native-elements';

const ModalComp = (props) => {
  //const [visible, setVisible] = useState(props.stateModal)
  const visible = props.stateModal
  const setModalState = props.setModalState
  const ocultarIconClose = props.ocultarIconClose || false

  return (
    <View>

      <Modal visible={visible} animationType="slide">
        {!ocultarIconClose && <Icon type="material-community" name="arrow-left-thick" color="#000" onPress={() => { setModalState(false) }} containerStyle={styles.iconContainer} />}
        <View>
          <Text style={styles.tituloCard}>{props.titulo}</Text>
          <View style={StyleSheet.children}>
            {props.children}
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default ModalComp

const styles = StyleSheet.create({
  iconContainer: {
    marginTop: 20
  },
  tituloCard: {
    fontSize: 25,
    marginLeft: 20,
    marginTop: 30,
    textAlign: 'center'
  }
})

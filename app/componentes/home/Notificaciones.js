import { StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'
import { Icon } from 'react-native-elements'

const Notificaciones = () => {
  const notificaciones = [
    { id: 1, titulo: "Lorem ipsum dolor sit amet" },
    { id: 2, titulo: "Lorem ipsum dolor" },
    { id: 3, titulo: "Lorem ipsum dolor" },
    { id: 4, titulo: "Lorem ipsum dolor sit amet, consectetur adipiscing elit  Maecenas iaculis" },
    { id: 5, titulo: "Lorem ipsum dolor" },
  ]
  return (
    <View>
      <FlatList
        data={notificaciones}
        renderItem={({ item }) => {
            return <View style={styles.notificationBox}>
              <Icon name="notification-clear-all" type='material-community'/>
              <Text style={styles.text} numberOfLines={2} ellipsizeMode='tail'>{item.titulo}</Text>
            </View>
        }}
        keyExtractor={(item) => item.id}
        numColumns={1}
      />
    </View>
  )
}

export default Notificaciones

const styles = StyleSheet.create({
  notificationBox: {
    width: "100%",
    height: 80,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    marginRight:10,
    marginLeft: 10,
    width: "90%",
  }
})
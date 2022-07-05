import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button } from "react-native-elements";

const ButtonHome = (props) => {
	const {icon,title,widthBtn,onPress} = props;

	const iconGeneral = {
		name: icon,
		type: "material-community",
		size: 35,
		color: "black",
	};

	return (
		<View>
			<Button title={title} containerStyle={{ width: widthBtn,	height: 119	}} buttonStyle={styles.buttonStyle} titleStyle={styles.titleBtn} icon={iconGeneral} iconContainerStyle={styles.iconContainer} onPress={onPress}/>
		</View>
	);
};

export default ButtonHome;

const styles = StyleSheet.create({
	buttonStyle: { 
		backgroundColor: "#E6E6E6",
		display: "flex",
		flexDirection: "column",
		marginTop: 10,
		marginLeft: 10,
		marginRight: 10
	},
	titleBtn: { color: "#000",marginBottom: 10, marginTop: 5, fontSize: 15 },
	iconContainer: { marginTop: 10 }
});

import { React, useEffect, useState, useRef, useContext } from "react";
import { StyleSheet, Text, ScrollView, View } from "react-native";
import { WebView } from 'react-native-webview';

export default function WebViewAfip() {
    return (
        <>
            <WebView
                style={styles.container}
                source={{ uri: 'https://desarrollo.gualeguaychu.gov.ar/loginnativeafip' }}
            />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,

    }
})
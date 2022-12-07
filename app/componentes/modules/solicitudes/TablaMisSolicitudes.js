import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import DataTable, { COL_TYPES } from 'react-native-datatable-component';
import stylesGral from '../../../utils/StyleSheetGeneral';
import estilosVar from '../../../utils/estilos';


const TablaMisSolicitudes = () => {
    return (
        <>
            <Text style={[stylesGral.tituloH3, stylesGral.textCentrado]}>Mis Solicitudes</Text>
            <DataTable
                data={[
                    { name: 'Muhammad Rafeh', age: 21, gender: 'male', otro: 'abcdfghi' },
                    { name: 'Muhammad Akif', age: 22, gender: 'male', otro: 'abcdfghi' },
                    { name: 'Muhammad Umar', age: 21, gender: 'male', otro: 'abcdfghi' },
                    { name: 'Amna Shakeel', age: 22, gender: 'female', otro: 'abcdfghi' },
                    { name: 'Muhammad Ammar', age: 20, gender: 'male', otro: 'abcdfghi' },
                    { name: 'Muhammad Moiz', age: 13, gender: 'male', otro: 'abcdfghi' }
                ]} // list of objects
                colNames={['name', 'age', 'gender', 'otro']} //List of Strings
                colSettings={[
                    { name: 'name', type: COL_TYPES.STRING },
                    { name: 'age', type: COL_TYPES.INT },
                    { name: 'gender', type: COL_TYPES.STRING },
                    { name: 'otro', type: COL_TYPES.STRING }
                ]}//List of Objects
                noOfPages={2} //number
                backgroundColor={estilosVar.verdeCemento} //Table Background Color
                headerLabelStyle={{ color: 'white', fontSize: 14, }} //Text Style Works
            //borderRadius={5}
            />
        </>
    )
}

export default TablaMisSolicitudes

const styles = StyleSheet.create({})
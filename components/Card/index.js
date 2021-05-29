import React, {useState, useEffect} from 'react';

import {
  AntDesign,
  MaterialCommunityIcons
} from '@expo/vector-icons';

import { 
    TouchableOpacity,
    StyleSheet, 
    Text, 
    View,
    Dimensions
  } from 'react-native';

import ColorPic  from '../ColorPicker';

export default function Card(props) {
    const [ bgColor, setBgColor ] = useState();
    const [ showPicker, setShowPicker ] = useState(false);
    const [ editIconMargin, setEditIconMargin ] = useState(0);
    
    let title = props?.title;
    let note = props?.note;
    
    let SlicedTitle = title?.length >= 35 ? title?.slice(0, 30)+'...': title
    let SlicedNote = note?.length >= 75 ? note?.slice(0, 60)+'...': note

    const editIconMarginLength = Dimensions.get('window').width === 320
    ? -90: Dimensions.get('window').width === 360
    ? -130: Dimensions.get('window').width === 411.42857142857144 || 411
    ? -200: Dimensions.get('window').width === 375
    ? -150: Dimensions.get('window').width === 414
    ? -170: Dimensions.get('window').width === 280
    ? -60: -205
    

    useEffect(()=>{
        setEditIconMargin(editIconMarginLength)
        setBgColor(props?.cardColor)
    })

    return(
        <View style={{
            backgroundColor: bgColor,
            width: '95%',
            height: 150,
            marginLeft: 10,
            marginBottom: 8,
            padding: 5,
            borderRadius: 10,
            elevation: 5,
            shadowColor: '#FFF',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
        }}>
            <TouchableOpacity>
                <Text
                    style={styles.cardTitle}
                    onPress={()=>{
                        props.edit?.(title, note, bgColor, props?.id)
                    }}
                >
                    {SlicedTitle}
                </Text>
                <Text 
                    style={styles.notePreview}
                    onPress={()=>{
                        props.edit?.(title, note, bgColor, props?.id)
                    }}
                >
                    {SlicedNote}
                </Text>
            </TouchableOpacity>

            <View style={styles.btnContainer}>
                <Text style={styles.timeInfo}>
                    {props?.time}
                </Text>

                <TouchableOpacity 
                    style={{
                        marginRight: editIconMargin
                    }}
                    onPress={()=>{
                        props.edit?.(title, note, bgColor, props?.id)
                    }}
                >
                    <MaterialCommunityIcons
                        name="square-edit-outline"
                        size={33}
                        color="white"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={{marginRight: 10}}
                    onPress={()=>{props.confirmExclusion?.(false, props?.id)}}
                >
                    <AntDesign
                        name="delete"
                        size={30}
                        color="white"
                    />
                </TouchableOpacity>
            </View>
            {showPicker &&
            <>
                <ColorPic show={setShowPicker} setColor={setBgColor}/>
            </>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    cardTitle: {
        width: '100%',
        height: 30,
        fontSize: 25,
        textAlign: 'center',
        color: '#FFF',
        borderBottomWidth: .3,
        borderBottomColor: 'gray'
    },
    notePreview: {
        flexWrap: 'wrap',
        width: '98%',
        height: 70,
        fontSize: 23,
        color: '#FFF',
        paddingTop: 10,
        paddingRight: 2,
        marginLeft: 5
    },
    btnContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 40,
        fontSize: 23,
        color: '#FFF',
    },
    timeInfo: {
        height: 40,
        fontSize: 15,
        color: '#FFF',
        alignSelf: 'flex-start',
        marginLeft: 5,
        textAlignVertical: 'center'
    },
})

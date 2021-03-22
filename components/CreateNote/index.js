import React, { useState } from 'react';

import { 
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Text,
  View,
  Keyboard,
  Animated
} from 'react-native';

import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons
} from '@expo/vector-icons'

import ColorPic  from '../ColorPicker';

export default function CreateNote(props) {
    const [title, setTitle] = useState("");
    const [text, setText]   = useState("");
    const [cardColor, setCardColor] = useState("#11bf5f");
    const [showPicker, setShowPicker] = useState(false);

    const [modalOpacity] = useState(new Animated.Value(0))

    Animated.timing(
      modalOpacity,
      {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }
    ).start()

    const closeModal = () => {
      Animated.timing(
        modalOpacity,
        {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }
      ).start()
      setTimeout(()=>{
        props.show?.()
      }, 200)
    }


    const [alert, setAlert] = useState({
      "alert": false, 
      "msg":""
    });

    const saveNote = () => {
      Keyboard.dismiss()
      if(!text && !title || title && !text) {
        setAlert({
          "alert":true,
          "msg":"Impossível salvar notas vazias!"
        })

      }else if(text && !title) {
        setAlert({
          "alert":true,
          "msg":"Por favor insira um título"
        })

      }else if(title && text){
        props.setNote?.(
          title,
          text,
          cardColor
        )
        closeModal()
        // props.show?.()
      }
    }

    const verifyEdited = () => {
      Keyboard.dismiss()
      
      if(title.length>0 
        || text.length>0 
        || cardColor!=="#11bf5f"
      ){
        setAlert({
          "alert":true,
          "msg":"Deseja salvar as alterações?"
        })

      }else{
        closeModal()
        // props.show?.()
      }
    }

    return(
      <Animated.View style={{
        backgroundColor: 'rgba(0, 0, 0,.7)',
        position: 'absolute',
        top: 67,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        zIndex: 999,
        opacity: modalOpacity
      }}>
        
        {alert.alert &&
          
          <View style={styles.alertContainer}>
            
            <View style={styles.alert}>
              
              <Text style={styles.alertText}>
                {alert.msg}
              </Text>

              {!alert.msg.includes("alterações")  && 
                
                <TouchableOpacity style={styles.alertBtn}>
                 
                  <Text
                    style={styles.alertBtnText}
                    onPress={()=>setAlert(false)}
                  >
                    OK
                  </Text>
                
                </TouchableOpacity>
              }

              {alert.msg.includes("alterações") &&
               
                <View style={styles.alertBtnYN}>
                  
                  <TouchableOpacity style={styles.alertBtnY}>
                   
                    <Text
                      style={styles.alertBtnTextY}
                      onPress={()=>{saveNote()}}
                    >
                      Sim
                    </Text>
                  
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.alertBtnN}>
                   
                    <Text
                      style={styles.alertBtnTextN}
                      onPress={()=>{setAlert(false); props.show?.()}}
                    >
                      Não
                    </Text>
                  </TouchableOpacity>
               
                </View>
              }
            
            </View>
          
          </View>
        
        }
        
        <View style={{
          position: 'absolute',
          backgroundColor: cardColor !== '#11bf5f'? cardColor: "#515151",
          top: '2%',
          width: '95%',
          height: '70%',
          borderRadius: 15
        }}>
          <View style={styles.headerContainer}>
            
            <TextInput
              style={styles.newNoteTitle}
              autoCorrect={false}
              placeholder="Insira um título"
              placeholderTextColor="#FFF"
              value={title}
              onChangeText={(value)=>setTitle(value)}
            />
            
            <TouchableOpacity
              style={styles.btnCloseNewNote}
              onPress={()=>{verifyEdited()}}
            >
              <AntDesign
                name="close"
                size={30}
                color="white"
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.newNoteTextContainer}>
            
            <TextInput
              style={styles.newNoteText}
              autoCorrect={false}
              multiline={true}
              numberOfLines = {30}
              value={text}
              placeholder="Clique para começar a digitar"
              placeholderTextColor="#FFF"
              onChangeText={(value)=>setText(value)}
            />
          
          </View>
          
          <View style={styles.newNoteBtnContainer}>
            
            <TouchableOpacity
              style={styles.newNoteBtnColorPalette}
              onPress={()=> {
                Keyboard.dismiss()
                setShowPicker(true) 
              }}
            >
              <MaterialCommunityIcons
                name="palette-outline"
                size={30}
                color="white"
              />
            </TouchableOpacity>
           
            <TouchableOpacity
              style={styles.newNoteBtnSave}
              onPress={()=>{
                Keyboard.dismiss()
                saveNote()
              }}
            >
              <FontAwesome
                name="save"
                size={30}
                color="white"
              />
            </TouchableOpacity>
          
          </View>
       
        </View>
        
        {showPicker &&
          <ColorPic 
            show={setShowPicker} 
            setColor={setCardColor}
          />
        }

      </Animated.View>
    )
}

const styles = StyleSheet.create({
  alertContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0.2,
    backgroundColor: 'rgba(160, 160, 160, .2)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  },
  alert: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative',
    top: '-10%',
    width: '90%',
    height: '20%',
    backgroundColor: '#2d2d2d',
    color: '#FFF',
    textAlign: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  alertText: {
    width: '100%',
    height: 65,
    fontSize: 25,
    color: '#FFF',
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  alertBtn: {
    backgroundColor: 'rgba(145, 145, 145, .3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 45,
    height: 45,
    maxHeight: 45,
    marginTop: 10,
    marginRight: -245,
    textAlign: 'center',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  alertBtnY: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 45,
    height: 45,
    maxHeight: 45,
    marginTop: 10,
  },
  alertBtnN: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 45,
    height: 45,
    maxHeight: 45,
    marginTop: 10,
  },
  alertBtnYN: {
    width: '100%',
    display:'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  alertBtnText: {
    color: '#FFF',
    width: '100%',
    fontSize: 25,
    textAlign: 'center',
    alignSelf: 'flex-end'
  },
  alertBtnTextY: {
    backgroundColor: '#1c8dd8',
    color: '#FFF',
    width: '100%',
    fontSize: 25,
    width: 52,
    height: 45,
    paddingTop: 7,
    textAlign: 'center',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  alertBtnTextN: {
    backgroundColor: 'rgba(145, 5, 5, .9)',
    color: '#FFF',
    width: '100%',
    fontSize: 25,
    width: 52,
    height: 45,
    paddingTop: 7,
    textAlign: 'center',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  headerContainer: {
    backgroundColor: '#606060',
    width: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnCloseNewNote: {
    width: 39,
    height: '100%',
    paddingTop: 7,
    borderTopRightRadius: 15,
  },
  newNoteTitle: {
    position: 'relative',
    fontSize: 25,
    width: '90%',
    height: 45,
    borderTopLeftRadius: 15,
    paddingHorizontal: 5,
    color: '#FFF',
    textAlign: 'center',
    
  },
  newNoteTextContainer: {
    flex: 3.3
    },
    newNoteText: {
    flex: 3,
    fontSize: 25,
    color: '#FFF',
    letterSpacing: 2,
    paddingHorizontal: 10,
    textAlign: 'left'
  },
  newNoteBtnContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1
  },
  newNoteBtnSave: {
    width: 75,
    display: 'flex',
    alignItems: 'center',
    padding: 5,
    textAlign: 'center',
    backgroundColor: '#2dad06',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  newNoteBtnColorPalette: {
    width: 75,
    display: 'flex',
    alignItems: 'center',
    padding: 5,
    textAlign: 'center',
    backgroundColor: '#a746f7',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  }
})
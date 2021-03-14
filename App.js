import React, { useState, useEffect } from 'react';

import {
  AntDesign,
} from '@expo/vector-icons';


import { 
  TouchableOpacity,
  StyleSheet, 
  Text, 
  View, 
  KeyboardAvoidingView,
  StatusBar,
  ScrollView,
  RefreshControl,
} from 'react-native';

import Card from './components/Card';
import CreateNote from './components/CreateNote';
import EditNote from './components/EditNote';
import ColorPic  from './components/ColorPicker';

import { storeNote, getNotes } from './Storage';
const editData = {};

let cardId = 0;

function App() {
  const [ showNewNoteContainer, setShowNewNoteContainer ] = useState(false)
  const [ showEditNoteContainer, setShowEditNoteContainer ] = useState(false)
  const [ showPicker, setShowPicker ] = useState(false);
  const [ changeCardColor, setCardColor ] = useState();

  const [ notes, setNotes ] = useState([]);
  const [ refreshing, setRefreshing ] = useState(false);
  const [ deleteCard, setDeleteCard ] = useState();

  const [ alert, setAlert ] = useState({
    "alert": false,
    "msg":""
  });

  const confirmExclusion = (confirmed=false, id="")=> {
    setDeleteCard(id)

    !confirmed &&
      setAlert({
          "alert":true,
          "msg":"Deseja realmente excluir?"
      })
  }

  const onRefresh = (time=0) => {
    setRefreshing(true);
    const fetchData = async ()=> {
      const data = await getNotes();
      if(data === undefined) {
        setNotes([])
        return;
      }
      setNotes(data)
    }

    fetchData();
    
    setTimeout(() => {
      setRefreshing(false)
    }, time)
  }

  const handleEdit = (editTitle,
    editText, bgColor, id) => {
    editData.title = editTitle;
    editData.note = editText;
    editData.id = id;
    editData.cardColor = bgColor;
    setShowEditNoteContainer(true)
  }
  
  const handleEditCardColor = id => 
  { 
    cardId = id
    setCardIdColor(id)
    setShowPicker(true)
  }
  
  const handlePressCloseBtn = () => {
    setShowNewNoteContainer(false)
  }
  const handlePressEditCloseBtn = () => {
    setShowEditNoteContainer(false)
  }
  
  const setNewNote = (
    title, text, bgcolor,
    editting=false,
    editId=0) => {
      
      if(editting){
        notes.splice(editId, 1)
      }
      
      notes.unshift({
        "bgcolor": bgcolor,
        "time": time(),
        "title":title,
        "text":text
      })
      
      storeNote(notes)
    }
    
  const deleteNote = (id) => {
    notes.splice(id, 1)
    storeNote(notes)
    setNotes(notes)
    onRefresh(5)
  }

  useEffect(() => {
    onRefresh(1000)
  },[])
  
  return (
    <KeyboardAvoidingView style={styles.background}>
      <View style={styles.container}>
        <StatusBar barStyle = "light-content"/>
        
        <View style={styles.titleView}>
          <Text style={styles.appTitle}>Notes</Text>
        </View>

        <ScrollView 
          style={styles.cardsContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
            refreshing={refreshing}
            onRefresh={()=>onRefresh(2000)}
            />
          }
          > 
          {notes!== undefined && notes?.length>0 && notes.map((note, key) => 
              <Card
                key={key}
                id={key}
                title={note.title}
                note={note.text}
                time={note.time}
                cardColor={note.bgcolor}
                delete={deleteNote}
                setNote={setNewNote}
                edit={handleEdit}
                editCardColor={handleEditCardColor}
                showPicker={setShowPicker}
                confirmExclusion={confirmExclusion}
              />
          )}
        </ScrollView>
          {notes.length==0 &&
            <Text style={styles.msg}>
              Clique no botão (+) para criar uma nota
            </Text>
          }
          {showNewNoteContainer &&
            <CreateNote
              show={handlePressCloseBtn}
              setNote={setNewNote}
            />
          }
          {/* Unused Component */}
          {showPicker &&
            <ColorPic show={setShowPicker} setColor={setCardColor}/>
          }
          {alert.alert &&
            <View style={styles.alertContainer}>
              <View style={styles.alert}>
                <Text style={styles.alertText}>
                  {alert.msg}
                </Text>

                {alert.msg &&
                  <View style={styles.alertBtnYN}>
                    <TouchableOpacity style={styles.alertBtnY}>
                      <Text
                        style={styles.alertBtnTextY}
                        onPress={()=>{
                          deleteNote(deleteCard)
                          setAlert(false)
                      }}>
                        Sim
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.alertBtnN}>
                      <Text
                        style={styles.alertBtnTextN}
                        onPress={()=>{setAlert(false)}}
                      >
                        Não
                      </Text>
                    </TouchableOpacity>
                  </View>
                }
              </View>
            </View>
          }
          {showEditNoteContainer && editData &&
            <EditNote
              show={handlePressEditCloseBtn}
              setNote={setNewNote}
              data={editData}
            />
          }
        <TouchableOpacity
          style={styles.btnCreateNewNote}
          onPress={()=>setShowNewNoteContainer(true)}
        >
          <AntDesign
            name="plus"
            size={30}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: '#060359',
    flex:1,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  msg: {
    position: 'absolute',
    width: '100%',
    height: 30,
    fontSize: 25,
    top: '50%',
    textAlign: 'center',
    color: '#FFF',
  },
  titleView:{
    width: '100%',
    height: 70,
    backgroundColor: '#6d0496',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
  },
  appTitle: {
    fontSize: 40,
    color: '#FFF'
  },
  cardsContainer: {
    width: '100%',
    maxHeight: '77%',
    flex: 1,
    marginTop: 15,
  },
  btnCreateNewNote: {
    width: 45,
    height: 45,
    position: 'absolute',
    bottom: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8603ba',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  }, alertContainer: {
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
    textAlignVertical: 'center',
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
    alignSelf: 'flex-start',
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
    backgroundColor: 'rgba(145, 5, 5, 1)',
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

})

const time = () => {
  const months = ['Jan','Fev','Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth();
  let hours = date.getHours();
  let minutes = date.getMinutes();

  hours = hours.toString().length === 1 ? `0${hours}`: hours;
  minutes = minutes.toString().length == 1 ? `0${minutes}`: minutes;
  date = `${day} ${months[month]} ${hours}:${minutes}`;
  return date;
}

export default App;

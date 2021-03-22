import React, { useState } from 'react';

import { ColorPicker } from 'react-native-color-picker';
import Slider from '@react-native-community/slider';

import { TouchableOpacity,
    Text,
    Dimensions,
    Animated
} from 'react-native';

export default function ColorPic(props){

    const [pickerModalOpacity] = useState(new Animated.Value(0))
   
    Animated.timing(
        pickerModalOpacity,
        {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
        }
    ).start()
  
    const closePickerModal = () => {
        Animated.timing(
            pickerModalOpacity,
            {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            }
        ).start()

        setTimeout(()=>{
            props.show?.(false)
        }, 100)
    }
    
    const pickerTextSize = Dimensions.get('window').width === 360
    ? 18 : 20

    return (
        <Animated.View style={{
            position: 'absolute',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            flex: 1,
            width: '100%',
            height: '90%',
            backgroundColor: 'rgba(0, 0, 0, .3)',
            opacity: pickerModalOpacity
        }}> 
            <Text style={{
                position: 'relative',
                fontSize: pickerTextSize,
                textAlign: 'center',
                width: '95%',
                bottom: '20%',
                color: '#FFF',
                borderTopLeftRadius: 25,
                borderTopRightRadius: 25,
                borderBottomLeftRadius: 25,
                borderBottomRightRadius: 25,
                paddingTop: 10,
                paddingBottom: 10,
                marginBottom: -10,
                backgroundColor: 'rgba(0, 0, 0, .5)'
            }}>
                Selecione uma cor clicando no círculo do centro
            </Text>
            <TouchableOpacity style={{
                position: 'absolute',
                flex: 1,
                width: '100%',
                height: '100%',
            }}
                onPress={()=> closePickerModal()}
            />
            <ColorPicker
                onColorSelected={color => props?.setColor(color)}
                sliderComponent={Slider}
                style={{
                    backgroundColor: '#3e3b7a',
                    top: '-15%',
                    width: '95%',
                    height: '60%',
                    padding: 25,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                }}
            />
        </Animated.View>
    )
}
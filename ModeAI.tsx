import { useState } from "react";
import { Button, Dimensions, GestureResponderEvent, Image, ImageBackground, NativeEventEmitter, StyleSheet, Text, TouchableWithoutFeedback, View, Alert } from "react-native";
import ImageList from './imageList';
import gameBackground from './images/beautiful-medieval-fantasy-landscape.jpg'
import React from "react";


 interface Position{
    x:number
    y:number
 }
const ModeAI=()=>{
    let ok:Boolean=false;
    const [maList,setList]=useState<Position[]>([]);
    const [maListAI,setListAI]=useState<Position[]>([]);
    const [text,setText]=useState('Placer vos joueurs sur le terrain');
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [playerScore, setPlayerScore] = useState(0);
    const [aiScore, setAIScore] = useState(0);

    let a:number=(Dimensions.get('window').width)/5;
    let b:number=(Dimensions.get('window').height)/5;
    const maxPlayer=5;
    function TranslateDimension(p:Position):Position{
        let x2=p.x;
        let y2=p.y;
        
        
         x2=(x2<0)?0:x2;
         x2=(x2>5*a)?4*a:x2;
 
         y2=(y2<0)?0:y2;
         y2=(y2>5*b)?4*b:y2;
        
         let pre:number=0;
         
         for(let i=1;i<=5;i++){
             let val=a*i;
             if(val>x2){
                 x2=pre;
                 break;
             }
            
             pre=val;
         }
         pre=0;
         for(let i=1;i<=5;i++){
             let val=i*b;
             if(y2<val){
                 y2=pre
                 break
             }
             pre=val;
         }
        
         
        return {x:(x2),y:(y2)};
     }

     function positionAI(){

     }

  
    function  onTouch(even:GestureResponderEvent){
        if(ok || isGameStarted)
            return ;
        let i=maList.length;
        let p:Position={x:even.nativeEvent.locationX,y:even.nativeEvent.locationY};
        p=TranslateDimension(p);
        let found:boolean=false;
        maList.forEach(element => {
            if(element.x==p.x && element.y==p.y){
                found=true;
            }
        });
        
        if(!found && maList.length<maxPlayer){
           setList([...maList,p])
           i++;
        }
        else if(found)
        {
            let newList=maList.filter(item=>(item.x!==p.x || item.y!==p.y));
            setList(newList);
            i--;
        }

        setText(i+'/'+maxPlayer)
        
        if(i === maxPlayer) {
            Alert.alert("Le match peut commencer");
            setIsGameStarted(true);
        }
    }

    //generation alleatoire des positions de l'IA
    function generateRandomPositions(): Position[] {
        const randomPositions: Position[] = [];
        for (let i = 0; i < 5; i++) {
            const x = Math.floor(Math.random() * 5) * a;
            const y = Math.floor(Math.random() * 5) * b;
            randomPositions.push({ x, y });
        }
        return randomPositions;
    }
    
    React.useEffect(() => {
        if (isGameStarted) {
            setListAI(generateRandomPositions());
        }
    }, [isGameStarted]);

    return(<View style={{height:'90%'}}>
        <TouchableWithoutFeedback onLongPress={onTouch}>
        <View style={styles.container} >
        </View>
        </TouchableWithoutFeedback>
        <View style={styles.flatList}>
        <ImageBackground source={gameBackground} style={styles.background}>
            {ImageList(maList)}
        </ImageBackground>
        </View>
        <View style={styles.bottomBar}>
            {isGameStarted ? (
                <Text style={styles.scoreText}>Player: {playerScore} VS AI: {aiScore}</Text>
            ) : (
                <Button title={text} color='rgb(49, 236, 74)'   onPress={()=>{}}></Button>
            )}
        </View>
        </View>
    );
}

const styles=StyleSheet.create({
    container:{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flex:1,
        width:'100%',
        height:'100%',
        borderWidth:2,
        borderRadius:10,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    background:{
        flex:1,
        resizeMode:'cover'
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
       
      },
      flatList: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        width:'100%',
        height:'100%',
    
      },
      button:{
        padding:5,
        borderRadius:5,
        backgroundColor:'ligthgreen',
        height:'100%'
      },
      text:{
        color:'black',
        fontWeight:'bold'
      },
      bottomBar:{
        position:'absolute',
        top:'100%',
        width:'100%',
        backgroundColor:'red',
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      scoreText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
      },
})
export default ModeAI;
export type {Position};
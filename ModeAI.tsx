import { useState } from "react";
import { Button, Dimensions, GestureResponderEvent, Image, ImageBackground, NativeEventEmitter, StyleSheet, Text, TouchableWithoutFeedback, View, Alert } from "react-native";
import ImageList from './imageList';
import gameBackground from './images/beautiful-medieval-fantasy-landscape.jpg';
import redDot from './images/redDot.png'; // Import the red dot image
import explosion from './images/explosion.png'; // Import the explosion image
import guerrier from './images/guerrier.png'; // Import the guerrier image
import yellowDot from './images/yellowDot.png'; // Import the yellow dot image
import React from "react";

interface Position {
    x: number;
    y: number;
}

const ModeAI = ({ navigation }) => {
    let ok: Boolean = false;
    const [maList, setList] = useState<Position[]>([]);
    const [maListAI, setListAI] = useState<Position[]>([]);
    const [text, setText] = useState('Disposez vos joueurs');
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [playerScore, setPlayerScore] = useState(0);
    const [aiScore, setAIScore] = useState(0);
    const [touchPosition, setTouchPosition] = useState<Position[]>([]); // State to store the touch positions
    const [explosions, setExplosions] = useState<Position[]>([]); // State to store explosion positions
    const [yellowDotPosition, setYellowDotPosition] = useState<Position | null>(null); // State to store yellow dot position

    let a: number = Dimensions.get('window').width / 5;
    let b: number = Dimensions.get('window').height / 5;
    const maxPlayer = 5;

    function TranslateDimension(p: Position): Position {
        let x2 = p.x;
        let y2 = p.y;

        x2 = x2 < 0 ? 0 : x2;
        x2 = x2 > 5 * a ? 4 * a : x2;

        y2 = y2 < 0 ? 0 : y2;
        y2 = y2 > 5 * b ? 4 * b : y2;

        let pre: number = 0;

        for (let i = 1; i <= 5; i++) {
            let val = a * i;
            if (val > x2) {
                x2 = pre;
                break;
            }

            pre = val;
        }
        pre = 0;
        for (let i = 1; i <= 5; i++) {
            let val = i * b;
            if (y2 < val) {
                y2 = pre;
                break;
            }
            pre = val;
        }

        return { x: x2, y: y2 };
    }

    function positionAI() {}

    function generateRandomPosition(): Position {
        const x = Math.floor(Math.random() * 5) * a;
        const y = Math.floor(Math.random() * 5) * b;
        return { x, y };
    }

    function onTouch(event: GestureResponderEvent) {
        if (ok) return;

        let i = maList.length;
        let p: Position = { x: event.nativeEvent.locationX, y: event.nativeEvent.locationY };
        let translatedPosition = TranslateDimension(p);
        let found: boolean = false;
        maList.forEach((element) => {
            if (element.x == translatedPosition.x && element.y == translatedPosition.y) {
                found = true;
            }
        });

        if (!isGameStarted) {
            if (!found && maList.length < maxPlayer) {
                // quand un jouer est placer
                setList([...maList, translatedPosition]);
                i++;
            } else if (found) {
                // quand un joeur est retirer(jouer a position a ete detecte)
                let newList = maList.filter((item) => item.x !== translatedPosition.x || item.y !== translatedPosition.y);
                setList(newList);
                i--;
            }

            setText(i + '/' + maxPlayer);

            if (i === maxPlayer) {
                Alert.alert('Le match peut commencer');
                setIsGameStarted(true);
            }
        } else {
            // Check if the touch position matches any position in maListAI
            const aiIndex = maListAI.findIndex((pos) => pos.x === translatedPosition.x && pos.y === translatedPosition.y);

            if (aiIndex !== -1) {
                // Add the explosion position
                setExplosions([...explosions, { x: event.nativeEvent.locationX, y: event.nativeEvent.locationY }]);

                // Remove the position from maListAI
                let newListAI = [...maListAI];
                newListAI.splice(aiIndex, 1);
                setListAI(newListAI);
                let sc = playerScore + 1;
                setPlayerScore(sc);
                //vous avez gagnez
                if (sc === 5) {
                    Alert.alert('Vous Avez Gagné', 'Player: ' + sc + ' AI: ' + aiScore);
                    navigation.navigate('Home');
                }
            } else {
                // Add the touch position exactly where it was touched when the game is started
                setTouchPosition([...touchPosition, { x: event.nativeEvent.locationX, y: event.nativeEvent.locationY }]);
            }

            // Generate a random position and set it for the yellow dot or explosion
            const randomPosition = generateRandomPosition();
            const isYellowDotOnPlayer = maList.some((pos) => pos.x === randomPosition.x && pos.y === randomPosition.y);

            if (isYellowDotOnPlayer) {
                // If the yellow dot position matches a player position, add an explosion instead
                setExplosions([...explosions, randomPosition]);

                // Remove the position from maList
                setList(maList.filter((pos) => pos.x !== randomPosition.x || pos.y !== randomPosition.y));
                
                // Increment AI score
                let scAI = aiScore + 1;
                setAIScore(scAI);

                // AI wins
                if (scAI === 5) {
                    Alert.alert('AI a Gagné', 'Player: ' + playerScore + ' AI: ' + scAI);
                    navigation.navigate('Home');
                }
            } else {
                setYellowDotPosition(randomPosition);
            }
        }
    }

    // generation alleatoire des positions de l'IA
    function generateRandomPositions(): Position[] {
        const randomPositions: Position[] = [];
        for (let i = 0; i < 5; i++) {
            const x = Math.floor(Math.random() * 5) * a;
            const y = Math.floor(Math.random() * 5) * b;
            randomPositions.push({ x, y });
            // Alert.alert("x: "+x.toString()+" y: "+y.toString())
        }
        return randomPositions;
    }

    React.useEffect(() => {
        if (isGameStarted) {
            setListAI(generateRandomPositions());
        }
    }, [isGameStarted]);

    return (
        <View style={{ height: '90%' }}>
            <TouchableWithoutFeedback onPress={onTouch}>
                <View style={styles.container}></View>
            </TouchableWithoutFeedback>
            <View style={styles.flatList}>
                <ImageBackground source={gameBackground} style={styles.background}>
                    {ImageList(maList)}
                    {touchPosition.map((pos, index) => (
                        <Image
                            key={index}
                            source={redDot}
                            style={{
                                position: 'absolute',
                                left: pos.x - 10, // Adjust to center the dot on the touch point
                                top: pos.y - 10, // Adjust to center the dot on the touch point
                                width: 20,
                                height: 20,
                            }}
                        />
                    ))}
                    {explosions.map((pos, index) => (
                        <Image
                            key={index}
                            source={explosion}
                            style={{
                                position: 'absolute',
                                left: pos.x - 15, // Adjust to center the explosion on the touch point
                                top: pos.y - 15, // Adjust to center the explosion on the touch point
                                width: 70,
                                height: 70,
                            }}
                        />
                    ))}
                    {yellowDotPosition && (
                        <Image
                            source={yellowDot}
                            style={{
                                position: 'absolute',
                                left: yellowDotPosition.x - 10, // Adjust to center the dot on the random position
                                top: yellowDotPosition.y - 10, // Adjust to center the dot on the random position
                                width: 20,
                                height: 20,
                            }}
                        />
                    )}
                </ImageBackground>
            </View>
            <View style={styles.bottomBar}>
                {isGameStarted ? (
                    <Text style={styles.scoreText}>Player: {playerScore} VS AI: {aiScore}</Text>
                ) : (
                    <Button title={text} color="rgb(255, 140, 0)" onPress={() => {}}></Button>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flex: 1,
        width: '100%',
        height: '100%',
        borderWidth: 2,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    background: {
        flex: 1,
        resizeMode: 'cover',
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
        width: '100%',
        height: '100%',
    },
    button: {
        padding: 5,
        borderRadius: 5,
        backgroundColor: 'lightgreen',
        height: '100%',
    },
    text: {
        color: 'black',
        fontWeight: 'bold',
    },
    bottomBar: {
        position: 'absolute',
        top: '100%',
        width: '100%',
        backgroundColor: 'red',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scoreText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default ModeAI;
export type { Position };

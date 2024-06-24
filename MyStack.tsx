import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login';
import SignUpScreen from './SignUp';
import SignUp from './SignUp';

const Stack = createStackNavigator();

export default function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
}
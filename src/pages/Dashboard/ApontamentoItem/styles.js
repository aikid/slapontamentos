import { Platform } from 'react-native';
import styled from 'styled-components/native';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import Icon from 'react-native-vector-icons/MaterialIcons'; 

export const Container = styled.KeyboardAvoidingView.attrs({
    enabled: Platform.OS == 'ios',
    behavior: 'padding',
})`
  flex:1;
  justify-content: center;
  align-items:center;
  padding: 0 30px;
`;

export const Form = styled.View`
    align-self: stretch;
    margin-top:50px;
`;

export const FormInput = styled(Input)`
    margin-bottom:10px;
`;

export const SubmitButton = styled(Button)`
    margin-top:5px;
    width: 375px;
`;

export const SignLink = styled.TouchableOpacity`
    margin-top:20px;
`;

export const SignLinkText = styled.Text`
    color:#fff;
    font-weight: bold;
    font-size: 16px;
    text-align:center;
`;

export const Intro = styled.Text`
    font-size: 18px;
    color: #fff;
    font-weight: 600;
    text-align: center;
    margin-top: 30px; 
    margin-bottom: 30px;
`;

export const IconTouch = styled(Icon)`
    color: rgba(255,255,255,0.6);
    position: absolute;
    bottom: 175px;
    right: 5px;
`;
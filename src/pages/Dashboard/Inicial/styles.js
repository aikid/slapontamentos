import { Platform } from 'react-native';
import styled from 'styled-components/native';
import Button from '../../../components/Button';

export const Container = styled.KeyboardAvoidingView.attrs({
    enabled: Platform.OS == 'ios',
    behavior: 'padding',
})`
  flex:1;
  justify-content: center;
  align-items:center;
  padding: 0 30px;
`;

export const ButtonContent = styled.View`
    align-self: stretch;
    margin-top:50px;
`;

export const SubmitButton = styled(Button)`
    margin-top:5px;
`;

export const Intro = styled.Text`
    font-size: 18px;
    color: #fff;
    font-weight: 600;
    text-align: center;
    margin-top: 30px; 
    margin-bottom: 30px;
`;
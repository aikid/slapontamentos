import { Platform } from 'react-native';
import styled from 'styled-components/native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Mask from '../../components/Mask';

export const Container = styled.KeyboardAvoidingView.attrs({
    enabled: Platform.OS == 'ios',
    behavior: 'padding',
})`
  flex:1;
  justify-content: center;
  align-items:center;
  padding: 0 30px;
`;

export const Title = styled.Text`
    font-size: 20px;
    color: #fff;
    font-weight: bold;
    align-self: center;
    margin-top: 30px;
`;

export const Form = styled.View`
    align-self: stretch;
    margin-top:50px;
`;

export const FormInput = styled(Input)`
    margin-bottom:10px;
`;

export const MaskInput = styled(Mask)`
    margin-bottom:10px;
`;

export const SubmitButton = styled(Button)`
    margin-top:5px;
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
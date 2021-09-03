import { Platform } from 'react-native';
import styled from 'styled-components/native';
import Input from '../../../components/Input';
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

export const Title = styled.Text`
    font-size: 20px;
    color: #fff;
    font-weight: bold;
    align-self: center;
    margin-top: 30px;
`;

export const Intro = styled.Text`
    font-size: 18px;
    color: #fff;
    font-weight: 600;
    text-align: center;
    margin-top: 30px; 
    margin-bottom: 30px;
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

export const CenteredView = styled.View`
    flex: 1;
    background-color: #d41132;
    justify-content: center;
    align-items: center;
`;

export const ModalView = styled.View`
      margin: 20px 0px 20px 0px;
      border-radius: 20px;
      align-items: center;
`;

export const FormModal = styled.View`
    margin: 20px;
    border-radius: 20px;
    padding:5px;
    align-items: center;
`;

export const OpenButton = styled.TouchableHighlight`
      border-radius: 4px;
      background-color: #fff;
      padding: 5px;
      width: 345px;
      margin-top: 10px;
`;

export const ModalTitle = styled.Text`
    font-size: 16px;
    color: #fff;
    font-weight: bold;
`;

export const ButtonTitle = styled.Text`
    font-size: 16px;
    color: #d41132;
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: center;
`;

export const GroupLinks = styled.View`
display: flex;
flex-direction: row;
`;
export const List = styled.FlatList.attrs({
    showsVerticalScrollIndicator: false,
    contentContainerStyle:{ padding: 30 }
})``;
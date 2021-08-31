import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
  flex: 1;
  padding: 30px;
`;

export const Form = styled.View`
    align-self: stretch;
    flex-direction: row;
    padding-bottom: 20px;
    border-bottom-width: 1px;
    border-color: #eee;
`;

export const Input = styled.TextInput.attrs({
    placeholderTextColor: '#999',
})`
    flex: 1;
    height: 40px;
    background: #eee;
    border-radius: 4px;
    padding: 0 15px;
    border: 1px solid #eee;
`;

export const SubmitButton =  styled(RectButton)`
    justify-content: center;
    align-items: center;
    background: #d41132;
    margin-left: 10px;
    padding: 0 12px;
    border-radius: 4px;
`;

export const Text =  styled.Text`
    padding-bottom: 15px;
`;

export const List = styled.FlatList.attrs({showsVerticalScrollIndicator: false})`
    margin-top: 20px;
`;

export const Message = styled.View`
    align-items: center;
    margin:0 20px 30px;
`;

export const Mtext = styled.Text`
    font-size: 14px;
    color: #333;
    font-weight:bold;
    margin-top:4px;
    text-align:center;
`;
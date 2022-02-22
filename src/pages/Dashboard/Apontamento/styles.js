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

export const Content = styled.View`
    align-self: stretch;
    margin-top:20px;
`;

export const SubmitButton = styled(Button)`
    margin-top:5px;
`;

export const ContentText = styled.Text`
    color:#fff;
    font-size: 16px;
`;

export const ContentTitle = styled.Text`
    font-size: 20px;
    color: #fff;
    font-weight: bold;
    align-self: center
    margin-top: 30px;
    margin-bottom: 30px;
`;

export const List = styled.FlatList.attrs({
    showsVerticalScrollIndicator: false,
    contentContainerStyle:{ padding: 0 }
})``;

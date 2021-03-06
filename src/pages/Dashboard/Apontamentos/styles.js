import { Platform } from 'react-native';
import styled from 'styled-components/native';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

export const Container = styled.SafeAreaView`
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
    width: 100%;
    margin-top:5px;
`;

export const Title = styled.Text`
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
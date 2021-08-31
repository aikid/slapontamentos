import Button from '../../../components/Button';
import Input from '../../../components/Input';
import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
    flex: 1;
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
    contentContainerStyle:{ padding: 30 }
})``;

export const SubmitButton = styled(Button)`
    margin:0px 30px 15px 30px;
`;

export const AddButton = styled(Button)`
    width:15%;
`;

export const Form = styled.View`
    padding: 0 30px;
    display: flex;
    flex-direction: row;
`;

export const FormInput = styled(Input)`
    margin-bottom:10px;
    width:82%;
    margin-right:10px;
`;
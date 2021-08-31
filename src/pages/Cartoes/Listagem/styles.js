import Button from '../../../components/Button';
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
    margin:15px 30px 15px 30px;
`;
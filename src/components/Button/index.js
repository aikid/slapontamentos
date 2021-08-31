import React from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { Container,Text } from './styles';

// import { Container } from './styles';

export default function Button({children, loading, ...rest}) {
  return (
    <Container {...rest}>
        {loading ? (
            <ActivityIndicator size="small" color="#d41132"/>
        ):(
            <Text>{children}</Text>
        )}
    </Container>
  );
}

Button.PropTypes = {
    children: PropTypes.string.isRequired,
    loading: PropTypes.bool,
};

Button.defaultProps = {
    loading: false,
};
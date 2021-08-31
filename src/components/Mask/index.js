import React, { forwardRef } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import PropTypes from 'prop-types';
import { Container, TMask } from './styles';

function Mask({ style,icon, ...rest }, ref) {
  return (
    <Container style={style}>
        {icon && <Icon name={icon} size={20} color="rgba(255,255,255,0.6)"/>}
        <TMask {...rest} ref={ref} />
    </Container>
  );
}

Mask.protoTypes = {
    icon: PropTypes.string,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
}

Mask.defaultProps = {
    icon: null,
    style: {},
}

export default forwardRef(Mask);
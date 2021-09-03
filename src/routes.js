import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createAppContainer, createSwitchNavigator, createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Senha from './pages/Senha';
import Inicial from './pages/Dashboard/Inicial';
import Apontamento from './pages/Dashboard/Apontamento';
import ApontamentoItem from './pages/Dashboard/ApontamentoItem';
import Apontamentos from './pages/Dashboard/Apontamentos';
import CriarApontamento from './pages/Dashboard/CriarApontamento';
import Cadastrar from './pages/Cartoes/Cadastrar';
import Listagem from './pages/Cartoes/Listagem';
import Voucher from './pages/Cartoes/Voucher';
import Perfil from './pages/Perfil';

export default (isSigned = false) => createAppContainer(
    createSwitchNavigator({
        Sign: createSwitchNavigator({
            SignIn,
            SignUp,
            Senha
        }),
        App:createBottomTabNavigator({
            Dashboard: {
                screen:createSwitchNavigator({
                    Inicial,
                    CriarApontamento,
                    Apontamento,
                    ApontamentoItem,
                    Apontamentos,
                },{
                    headerLayoutPreset:'center',
                    defaultNavigationOptions:{
                        headerTransparent: true,
                        headerTintColor: '#FFF',
                        headerLeftContainerStyle:{
                            marginLeft:20,
                        }
                    },
                }),
                navigationOptions:{
                    tabBarVisible: false,
                    tabBarLabel: 'Comprar',
                    tabBarIcon:(
                      <Icon name="shopping-basket" size={20} color="rgba(255,255,255,0.6)"/>
                    ),
                },
            },
            Perfil,
            Cartoes:createBottomTabNavigator({
                    Listagem,
                    Cadastrar,
                    Voucher
                },{
                   navigationOptions:{
                        tabBarVisible: false,
                        tabBarLabel: 'Cartões',
                        tabBarIcon:(
                        <Icon name="credit-card" size={20} color="rgba(255,255,255,0.6)"/>
                        ),
                    },
                    tabBarOptions: {
                        keyboardHidesTabBar: true,
                        activeTintColor: '#fff',
                        inactiveTintColor: 'rgba(255,255,255,0.6)',
                        style: {
                            backgroundColor: '#d41132',
                        }
                    }
            }),
        }, {
            resetOnBlur:true,
            tabBarOptions: {
                keyboardHidesTabBar: true,
                activeTintColor: '#fff',
                inactiveTintColor: 'rgba(255,255,255,0.6)',
                style: {
                    backgroundColor: '#d41132',
                }
            }
        })
    }, {
        initialRouteName: isSigned ? 'App' : 'Sign',
    })
);
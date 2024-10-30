import {
    View, Text, Image, TouchableOpacity,
    StyleSheet, FlatList, Alert, Modal, TextInput
  } from 'react-native';
  import React, { useEffect, useState } from 'react';
  import axios from 'axios';
  
  interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar: string;
  }
  
  const App = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
  
    const fetchData = async () => {
        try {
            const response = await axios.get('https://reqres.in/api/users?per_page=2');
            setUsers(response.data.data);
        } catch (error) {
            console.log('Fetch Error:', error);
        }
    };
  
    // POST
    const postData = async () => {
        try {
            const newUser = {
                first_name: firstName,
                last_name: lastName,
                email: email,
                avatar: avatar,
            };
  
            const response = await axios.post('https://reqres.in/api/users', newUser);
            const userWithID = { id: response.data.id, ...newUser };
  
            setUsers((prevUsers) => [...prevUsers, userWithID]);
            Alert.alert('User Created', 'User berhasil ditambahkan');
  
            // Reset form and close modal
            resetForm();
            setModalVisible(false);
        } catch (error) {
            console.log('Post Error:', error);
        }
    };
  
    const resetForm = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setAvatar('');
    };
  
    // PUT
    const updateData = async (id: number) => {
        try {
            const updatedUser = {
                first_name: firstName,
                last_name: lastName,
                email: email,
                avatar: avatar,
            };
  
            await axios.put(`https://reqres.in/api/users/${id}`, updatedUser);
  
            // Update state langsung tanpa fetch ulang
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === id ? { ...user, ...updatedUser } : user
                )
            );
  
            Alert.alert('User Updated', `User ID: ${id} berhasil di Update`);
            resetForm();
            setModalVisible(false);
        } catch (error) {
            console.log('Update Error:', error);
        }
    };
  
    // DELETE
    const deleteData = async (id: number) => {
        try {
            await axios.delete(`https://reqres.in/api/users/${id}`);
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
            Alert.alert('User Deleted', `User ID: ${id} berhasil di Delete`);
        } catch (error) {
            console.log('Delete Error:', error);
        }
    };
  
    useEffect(() => {
        fetchData();
    }, []);
  
    const renderItem = ({ item }: { item: User }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.avatar }} style={styles.image} />
            <View style={styles.cardContent}>
                <Text style={styles.name}>
                    {item.first_name} {item.last_name}
                </Text>
                <Text style={styles.email}>
                    {item.email}
                </Text>
                <View style={styles.actionContainer}>
                    <TouchableOpacity
                        style={styles.updateButton}
                        onPress={() => {
                            setSelectedUser(item);
                            setFirstName(item.first_name);
                            setLastName(item.last_name);
                            setEmail(item.email);
                            setAvatar(item.avatar);
                            setModalVisible(true);
                        }}
                    >
                        <Text style={styles.buttonText}>Update</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => deleteData(item.id)}
                    >
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
  
    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={
                    <>
                        <Text style={styles.header}>API dari Reqres.in - Alfi</Text>
                        <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
                            <Text style={styles.buttonText}>Tambah User</Text>
                        </TouchableOpacity>
                    </>
                }
                contentContainerStyle={styles.list}
            />
  
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>{selectedUser ? 'Update User' : 'Tambah User'}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="First Name"
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Last Name"
                        value={lastName}
                        onChangeText={setLastName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Avatar URL"
                        value={avatar}
                        onChangeText={setAvatar}
                    />
  
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={() => {
                            if (selectedUser) {
                                updateData(selectedUser.id);
                            } else {
                                postData();
                            }
                        }}
                    >
                        <Text style={styles.buttonText}>{selectedUser ? 'Update' : 'Simpan'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => {
                            setModalVisible(false);
                            resetForm();
                        }}
                    >
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
  };
  
  export default App;
  
  const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f3f4f6',
        flex: 1,
    },
    header: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 16,
        textAlign: 'center',
        color: '#333',
    },
    createButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 13,
        fontWeight: '600',
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginBottom: 16,
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    image: {
        width: 100,
        height: 125,
        marginRight: 12,
    },
    cardContent: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
    },
    name: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 4,
        color: '#333',
    },
    email: {
        fontSize: 12,
        marginBottom: 4,
        color: '#777',
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 17,
    },
    updateButton: {
        backgroundColor: '#FFA500',
        padding: 8,
        borderRadius: 5,
    },
    deleteButton: {
        backgroundColor: '#FF6347',
        padding: 8,
        borderRadius: 5,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 15,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        width: '100%',
        paddingHorizontal: 10,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        width: '100%',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#FF6347',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        width: '100%',
        alignItems: 'center',
    },
  });
  
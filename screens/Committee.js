import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking } from 'react-native';

const committeeData = [
    {
      position: 'Honorary Conference Co-Chairs',
      members: [
        {
          id: 1,
          name: 'Professor Shirley Gregor',
          university: 'Australian National University',
          universityUrl: 'https://rsm.anu.edu.au/about/staff-directory/professor-shirley-gregor',
          imageUrl: 'https://acis.aaisnet.org/acis2024/wp-content/uploads/2024/03/shirley-gregor.png',
        },
        {
          id: 2,
          name: 'Professor Craig McDonald',
          university: 'University of Canberra',
          universityUrl: 'https://www.researchgate.net/profile/Craig-Mcdonald-8',
          imageUrl: 'https://acis.aaisnet.org/acis2024/wp-content/uploads/2024/03/craig-mcdonald.png',
        },
      ],
    },
    {
      position: 'Conference Co-Chairs',
      members: [
        {
          id: 3,
          name: 'Associate Professor Blooma John',
          university: 'University of Canberra',
          universityUrl: 'https://researchprofiles.canberra.edu.au/en/persons/blooma-john',
          imageUrl: 'https://acis.aaisnet.org/acis2024/wp-content/uploads/2024/03/blooma-john.png',
        },
        {
          id: 4,
          name: 'Associate Professor Ahmed Imran',
          university: 'University of Canberra',
          universityUrl: 'https://researchprofiles.canberra.edu.au/en/persons/ahmed-imran',
          imageUrl: 'https://acis.aaisnet.org/acis2024/wp-content/uploads/2024/03/ahmed-imran.png',
        },
        {
          id: 5,
          name: 'Professor Israr Qureshi',
          university: 'Australian National University',
          universityUrl: 'https://rsm.anu.edu.au/about/staff-directory/professor-israr-qureshi',
          imageUrl: 'https://acis.aaisnet.org/acis2024/wp-content/uploads/2024/03/israr-qureshi.png',
        },
      ],
    },
    {
      position: 'Doctoral Consortium Co-Chairs',
      members: [
        {
          id: 6,
          name: 'Professor Atreyi Kankanhalli',
          university: 'National University of Singapore',
          universityUrl: 'https://www.comp.nus.edu.sg/disa/people/atreyi/',
          imageUrl: 'https://acis.aaisnet.org/acis2024/wp-content/uploads/2024/03/atreyi-kankanhalli.png',
        },
        {
          id: 7,
          name: 'Dr Jayan Kurian',
          university: 'University of Technology Sydney',
          universityUrl: 'https://profiles.uts.edu.au/JayanChirayathKurian',
          imageUrl: 'https://acis.aaisnet.org/acis2024/wp-content/uploads/2024/03/jayan-kurian.png',
        },
        {
          id: 8,
          name: 'Professor Rodney Clarke',
          university: 'University of Wollongong',
          universityUrl: 'https://scholars.uow.edu.au/rod-clarke',
          imageUrl: 'https://acis.aaisnet.org/acis2024/wp-content/uploads/2024/03/rodney-clake.png',
        },
        {
          id: 9,
          name: 'Professor Andrew Burton-Jones',
          university: 'University of Queensland',
          universityUrl: 'https://business.uq.edu.au/profile/122/andrew-burton-jones',
          imageUrl: 'https://acis.aaisnet.org/acis2024/wp-content/uploads/2024/03/andrew-burton-jones-150x150.jpeg',
        },
      ],
    },
    {
      position: 'Organising Chair',
      members: [
        {
          id: 10,
          name: 'Dr Micheal Axelsen',
          university: 'University of Queensland',
          universityUrl: 'https://business.uq.edu.au/profile/200/micheal-axelsen',
          imageUrl: 'https://acis.aaisnet.org/acis2024/wp-content/uploads/2023/05/micheal-axelsen-150x150.jpeg',
        },
      ],
    },
    {
      position: 'Poster Slam Co-Chairs',
      members: [
        {
          id: 11,
          name: 'Professor Michael Leyer',
          university: 'University of Marburg / Queensland University of Technology',
          universityUrl: 'https://www.uni-marburg.de/de/fb02/professuren/bwl/digiprozess/team/leyer',
          imageUrl: 'https://acis.aaisnet.org/acis2024/wp-content/uploads/2024/06/michael-leyer.jpeg',
        },
        {
          id: 12,
          name: 'John James',
          university: 'University of Wollongong',
          universityUrl: 'https://scholars.uow.edu.au/john-james',
          imageUrl: 'https://acis.aaisnet.org/acis2024/wp-content/uploads/2024/06/john-james.jpg',
        },
      ],
    },
    {
      position: 'TREO Talks Co-Chairs',
      members: [
        {
          id: 13,
          name: 'Dr Ali Eshraghi',
          university: 'University of Canberra',
          universityUrl: 'https://researchprofiles.canberra.edu.au/en/persons/ali-eshraghi',
          imageUrl: 'https://acis.aaisnet.org/acis2024/wp-content/uploads/2024/06/ali-eshraghi-150x150.jpg',
        },
        {
          id: 14,
          name: 'Associate Professor Alex Richardson',
          university: 'Australian National University',
          universityUrl: 'https://cbe.anu.edu.au/about/staff-directory/associate-professor-alex-richardson',
          imageUrl: 'https://acis.aaisnet.org/acis2024/wp-content/uploads/2024/06/alex-richardson-e1718097593190-150x150.jpg',
        },
        {
          id: 15,
          name: 'Professor Kristine Dery',
          university: 'Macquarie University',
          universityUrl: 'https://researchers.mq.edu.au/en/persons/kristine-dery',
          imageUrl: 'https://acis.aaisnet.org/acis2024/wp-content/uploads/2024/06/K_dery_cropped-150x150.webp',
        },
      ],
    },
    {
      position: 'Industry Sponsor Co-Chairs',
      members: [
        {
          id: 16,
          name: 'Assistant Professor Rosetta Romano',
          university: 'University of Canberra',
          universityUrl: 'https://researchprofiles.canberra.edu.au/en/persons/rosetta-romano-2',
          imageUrl: 'https://acis.aaisnet.org/acis2024/wp-content/uploads/2024/03/rosetta-romano.png',
        },
        {
          id: 17,
          name: 'Dr Rod Dilnutt',
          university: 'University of Melbourne',
          universityUrl: 'https://findanexpert.unimelb.edu.au/profile/12147-rod-dilnutt',
          imageUrl: 'https://acis.aaisnet.org/acis2024/wp-content/uploads/2022/04/rod-dilnutt-200px-150x150.jpg',
        },
        {
          id: 18,
          name: 'Associate Professor Abu Barkat Ullah',
          university: 'University of Canberra',
          universityUrl: 'https://researchprofiles.canberra.edu.au/en/persons/barkat-barkat-ullah',
          imageUrl: 'https://acis.aaisnet.org/acis2024/wp-content/uploads/2024/03/abu-barkat-ullah-150x150.jpg',
        },
      ],
    },
    {
      position: 'Workshop and Panel Co-Chairs',
      members: [
        {
          id: 19,
          name: 'Associate Professor Felix Ter Chian Tan',
          university: 'University of New South Wales',
          universityUrl: 'https://www.unsw.edu.au/staff/felix-tan',
          imageUrl: 'https://acis.aaisnet.org/acis2024/wp-content/uploads/2024/03/felix-ter-chian-tan.png',
        },
        {
          id: 20,
          name: 'Associate Professor Lubna Alam',
          university: 'Deakin University',
          universityUrl: 'https://www.deakin.edu.au/about-deakin/people/lubna-alam',
          imageUrl: 'https://acis.aaisnet.org/acis2024/wp-content/uploads/2024/03/lubna-alam.png',
        },
        {
          id: 21,
          name: 'Dr Zeena Jamal Alsamarra’I',
          university: 'University of Canberra',
          universityUrl: 'https://acis.aaisnet.org/acis2024/wp-content/uploads/2024/03/zeena-jamal-lsamarrai.png',
          imageUrl: 'https://acis.aaisnet.org/acis2024/wp-content/uploads/2024/03/zeena-jamal-lsamarrai.png',
       

        },
      ],
    },
  ];

  

const CommitteeScreen = () => {
  const handlePress = (url) => {
    Linking.openURL(url);
  };

  return (
        <ScrollView style={styles.container}>
      {committeeData.map((section, index) => (
        <View key={index}>
          <Text style={styles.heading}>{section.position}</Text>
          <View style={styles.memberContainer}>
            {section.members.map((member) => (
              <View key={member.id} style={styles.card}>
                <TouchableOpacity onPress={() => handlePress(member.universityUrl)}>
                  <Image source={{ uri: member.imageUrl }} style={styles.image} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePress(member.universityUrl)}>
                  <Text style={styles.name}>{member.name}</Text>
                </TouchableOpacity>
                <Text style={styles.university}>{member.university}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  memberContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    width: '30%', // Adjust to fit three cards in a row
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  university: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 10,
  },
  link: {
    fontSize: 14,
    color: '#007bff',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default CommitteeScreen;

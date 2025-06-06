import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { ConfigContext } from '~/contexts/config';
import { playSong } from '~/utils/player';
import { SongDispatchContext } from '~/contexts/song';
import { ThemeContext } from '~/contexts/theme';
import { urlCover } from '~/utils/api';
import IconButton from '~/components/button/IconButton';
import ImageError from '~/components/ImageError';
import mainStyles from '~/styles/main';
import size from '~/styles/size';

const HistoryItem = ({ itemHist, index, setQuery, delItemHistory }) => {
	const config = React.useContext(ConfigContext)
	const songDispatch = React.useContext(SongDispatchContext)
	const theme = React.useContext(ThemeContext)
	const navigation = useNavigation()

	const handlePress = () => {
		if (typeof itemHist === 'string') {
			setQuery(itemHist)
		} else if (itemHist.mediaType === 'song') {
			playSong(config, songDispatch, [itemHist], 0)
		} else if (itemHist.mediaType === 'album') {
			navigation.navigate('Album', itemHist)
		} else if (itemHist.artistImageUrl) {
			navigation.navigate('Artist', itemHist)
		}
	}

	return (
		<Pressable key={index} onPress={handlePress} style={({ pressed }) => ([mainStyles.opacity({ pressed }), {
			marginHorizontal: 20,
			flexDirection: 'row',
			alignItems: 'center',
			paddingVertical: typeof itemHist === 'object' ? 0 : 6,
		}])}>
			{
				typeof itemHist === 'object' ? (
					<>
						<ImageError
							source={{ uri: urlCover(config, itemHist, 100) }}
							style={{
								width: 45,
								height: 45,
								borderRadius: itemHist.mediaType ? 3 : size.radius.circle,
								marginEnd: 10,
								backgroundColor: theme.secondaryBack,
							}}
						/>
						<View style={{ flex: 1, flexDirection: 'column' }}>
							<Text numberOfLines={1} style={{ color: theme.primaryText, fontSize: size.text.small, marginBottom: 2 }}>{itemHist.name || itemHist.title}</Text>
							<Text numberOfLines={1} style={{ color: theme.secondaryText, fontSize: size.text.small }}>{itemHist.mediaType || 'artist'} · {itemHist.artist}</Text>
						</View>
					</>
				) : (
					<>
						<Icon name="eye" size={17} color={theme.secondaryText} style={{ width: 45, marginEnd: 10, textAlign: 'center' }} />
						<Text style={{ color: theme.secondaryText, fontSize: size.text.medium }}>{itemHist}</Text>
					</>
				)
			}
			<IconButton
				icon="times"
				size={14}
				color={theme.secondaryText}
				style={{ position: 'absolute', top: 0, right: 0, height: '100%', justifyContent: 'center', paddingHorizontal: 10 }}
				onPress={() => delItemHistory(index)}
			/>
		</Pressable>
	)
}

export default HistoryItem
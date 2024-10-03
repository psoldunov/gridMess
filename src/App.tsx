import '@mantine/core/styles.css';
import './App.css';

import { MantineProvider } from '@mantine/core';
import Griddle from './grid/Griddle';

function App() {
	return (
		<MantineProvider forceColorScheme='dark'>
			<Griddle />
		</MantineProvider>
	);
}

export default App;

import '@mantine/core/styles.css';
import './App.css';

import { MantineProvider } from '@mantine/core';
import Griddle from './grid/Griddle';
import SortableExample from './grid/SortableExample';

function App() {
	return (
		<MantineProvider forceColorScheme='dark'>
			<Griddle />
			<SortableExample />
		</MantineProvider>
	);
}

export default App;

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface Task {
  id: string;
  name: string;
  completed: boolean;
}

export default function WorkManagerScreen() {
  const colorScheme = useColorScheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState('');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const colors = Colors[colorScheme ?? 'light'];

  const addTask = () => {
    if (input.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        name: input.trim(),
        completed: false,
      };
      setTasks([newTask, ...tasks]);
      setInput('');
    }
  };

  const toggleComplete = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const speakTask = async (taskName: string, taskId: string) => {
    try {
      if (speakingId === taskId) {
        await Speech.stop();
        setSpeakingId(null);
      } else {
        await Speech.stop();
        setSpeakingId(taskId);
        await Speech.speak(taskName, {
          onDone: () => setSpeakingId(null),
          onError: () => setSpeakingId(null),
        });
      }
    } catch (error) {
      setSpeakingId(null);
    }
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View
      style={[
        styles.taskRow,
        { borderBottomColor: colorScheme === 'dark' ? '#333' : '#eee' },
      ]}
    >
      <TouchableOpacity
        onPress={() => toggleComplete(item.id)}
        style={styles.checkboxContainer}
      >
        <MaterialCommunityIcons
          name={item.completed ? 'checkbox-marked' : 'checkbox-blank-outline'}
          size={24}
          color={colors.tint}
        />
      </TouchableOpacity>

      <ThemedText
        style={[
          styles.taskName,
          item.completed && styles.completedText,
        ]}
        numberOfLines={2}
      >
        {item.name}
      </ThemedText>

      <TouchableOpacity
        onPress={() => speakTask(item.name, item.id)}
        style={styles.actionButton}
      >
        <MaterialCommunityIcons
          name={speakingId === item.id ? 'microphone' : 'microphone-outline'}
          size={20}
          color={colors.tint}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => deleteTask(item.id)}
        style={styles.actionButton}
      >
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={20}
          color={colors.tint}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colorScheme === 'dark' ? '#333' : '#eee' }]}>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f5f5f5',
                color: colorScheme === 'dark' ? '#fff' : '#000',
                borderColor: colorScheme === 'dark' ? '#555' : '#ddd',
              },
            ]}
            placeholder="Add a new task..."
            placeholderTextColor={colorScheme === 'dark' ? '#888' : '#999'}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={addTask}
          />
          <TouchableOpacity
            onPress={addTask}
            style={[styles.addButton, { backgroundColor: colors.tint }]}
          >
            <MaterialCommunityIcons name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="clipboard-list-outline"
            size={64}
            color={colors.tint}
            style={{ opacity: 0.5 }}
          />
          <ThemedText style={styles.emptyText}>No tasks yet. Add one to get started!</ThemedText>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={item => item.id}
          scrollEnabled={true}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  checkboxContainer: {
    padding: 4,
  },
  taskName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  actionButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
});

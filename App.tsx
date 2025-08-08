import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar
} from 'react-native';
import {
  CreditCard,
  Send,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  EyeOff,
  MessageCircle,
  Bell,
  User,
  Moon,
  Sun,
  Home,
  PieChart,
  History,
  Phone
} from 'lucide-react-native';
import { NativeModules } from 'react-native';

const { MobileMessengerSdk } = NativeModules;

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  const handleStartChat = () => {
    const deploymentId = '5f8fdc66-7542-496a-88cd-a119bb148828';
    const domain = 'mypurecloud.jp';
    const logging = false;

    const customData = {
      department: "sales",
      property_type: "apartment",
      device: "mobile"
    };


    if (MobileMessengerSdk && MobileMessengerSdk.startChat) {
      MobileMessengerSdk.startChat(deploymentId, domain, logging, JSON.stringify(customData));
    } else {
      console.warn('MobileMessengerSdk is not available. Make sure native module is linked correctly.');
    }
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleBalance = () => setBalanceVisible(!balanceVisible);

  const theme = {
    background: isDarkMode ? '#0f0f23' : '#f8fafc',
    cardBg: isDarkMode ? '#1e1e3f' : '#ffffff',
    text: isDarkMode ? '#e2e8f0' : '#1e293b',
    textSecondary: isDarkMode ? '#94a3b8' : '#64748b',
    primary: '#3b82f6',
    primaryDark: '#2563eb',
    success: '#10b981',
    danger: '#ef4444',
    border: isDarkMode ? '#334155' : '#e2e8f0',
    accent: isDarkMode ? '#8b5cf6' : '#6366f1'
  };

  const transactions = [
    { id: 1, type: 'expense', title: 'Coffee Shop', amount: -4.50, date: 'Today', category: 'Food' },
    { id: 2, type: 'income', title: 'Salary Deposit', amount: 3200.00, date: 'Yesterday', category: 'Income' },
    { id: 3, type: 'expense', title: 'Netflix Subscription', amount: -12.99, date: '2 days ago', category: 'Entertainment' },
    { id: 4, type: 'expense', title: 'Grocery Store', amount: -67.80, date: '3 days ago', category: 'Food' }
  ];

  const quickActions = [
    { id: 1, icon: Send, title: 'Send Money', color: theme.primary },
    { id: 2, icon: ArrowDownLeft, title: 'Request', color: theme.success },
    { id: 3, icon: CreditCard, title: 'Pay Bills', color: theme.accent },
    { id: 4, icon: MessageCircle, title: 'Support Chat', color: theme.primaryDark, action: handleStartChat }
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.cardBg, borderBottomColor: theme.border }]}>
          <View style={styles.headerLeft}>
            <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
              <User size={20} color="white" />
            </View>
            <View>
              <Text style={[styles.welcomeText, { color: theme.textSecondary }]}>Welcome back</Text>
              <Text style={[styles.userName, { color: theme.text }]}>John Doe</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={toggleTheme} style={[styles.iconButton, { backgroundColor: theme.background }]}>
              {isDarkMode ? <Sun size={20} color={theme.text} /> : <Moon size={20} color={theme.text} />}
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Bell size={20} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance Card */}
        <View style={[styles.balanceCard, { backgroundColor: theme.primary }]}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceValue}>
              {balanceVisible ? '$12,547.85' : '••••••'}
            </Text>
            <TouchableOpacity onPress={toggleBalance}>
              {balanceVisible ? <EyeOff size={20} color="#fff" /> : <Eye size={20} color="#fff" />}
            </TouchableOpacity>
          </View>
          <View style={styles.balanceStats}>
            <View style={styles.balanceStat}>
              <ArrowUpRight size={16} color="#fff" />
              <Text style={styles.statLabel}>Income</Text>
              <Text style={styles.statValue}>$3,200</Text>
            </View>
            <View style={styles.balanceStat}>
              <ArrowDownLeft size={16} color="#fff" />
              <Text style={styles.statLabel}>Expenses</Text>
              <Text style={styles.statValue}>$1,847</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
          <View style={styles.quickActions}>
            {quickActions.map(action => (
              <TouchableOpacity
                key={action.id}
                onPress={action.action || (() => { })}
                style={[styles.quickAction, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
              >
                <View style={[styles.quickIcon, { backgroundColor: `${action.color}15` }]}>
                  <action.icon size={20} color={action.color} />
                </View>
                <Text style={[styles.quickText, { color: theme.text }]}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.transactionsHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Transactions</Text>
          </View>
          {transactions.map(tx => (
            <View key={tx.id} style={[styles.transactionCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
              <View style={[styles.transactionIcon, { backgroundColor: tx.type === 'income' ? `${theme.success}15` : `${theme.danger}15` }]}>
                {tx.type === 'income'
                  ? <ArrowDownLeft size={20} color={theme.success} />
                  : <ArrowUpRight size={20} color={theme.danger} />}
              </View>
              <View style={styles.transactionDetails}>
                <Text style={[styles.transactionTitle, { color: theme.text }]}>{tx.title}</Text>
                <Text style={[styles.transactionMeta, { color: theme.textSecondary }]}>{tx.date} • {tx.category}</Text>
              </View>
              <Text style={{ color: tx.type === 'income' ? theme.success : theme.danger, fontWeight: '600' }}>
                {tx.type === 'income' ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { backgroundColor: theme.cardBg, borderTopColor: theme.border }]}>
        {[
          { id: 'home', icon: Home, label: 'Home' },
          { id: 'analytics', icon: PieChart, label: 'Analytics' },
          { id: 'history', icon: History, label: 'History' },
          { id: 'support', icon: Phone, label: 'Support', action: handleStartChat }
        ].map(item => (
          <TouchableOpacity
            key={item.id}
            onPress={item.action || (() => setActiveTab(item.id))}
            style={styles.navItem}
          >
            <item.icon size={20} color={activeTab === item.id || item.action ? theme.primary : theme.textSecondary} />
            <Text style={{ color: activeTab === item.id || item.action ? theme.primary : theme.textSecondary, fontWeight: activeTab === item.id || item.action ? '600' : '400', fontSize: 12 }}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  welcomeText: { fontSize: 12 },
  userName: { fontSize: 16, fontWeight: '600' },
  headerRight: { flexDirection: 'row' },
  iconButton: { padding: 8, borderRadius: 50, marginLeft: 8 },
  balanceCard: { margin: 16, borderRadius: 16, padding: 16 },
  balanceLabel: { color: '#fff', opacity: 0.8, fontSize: 12 },
  balanceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  balanceValue: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginRight: 8 },
  balanceStats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: 12 },
  balanceStat: { alignItems: 'center' },
  statLabel: { color: '#fff', opacity: 0.8, fontSize: 10, marginTop: 2 },
  statValue: { color: '#fff', fontSize: 14, fontWeight: '600' },
  section: { paddingHorizontal: 16, marginTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between' },
  quickAction: { flex: 1, alignItems: 'center', padding: 12, marginHorizontal: 4, borderWidth: 1, borderRadius: 12 },
  quickIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  quickText: { fontSize: 10, textAlign: 'center' },
  transactionsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  transactionCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  transactionIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  transactionDetails: { flex: 1 },
  transactionTitle: { fontWeight: '500' },
  transactionMeta: { fontSize: 10 },
  bottomNav: { flexDirection: 'row', borderTopWidth: 1, position: 'absolute', bottom: 0, left: 0, right: 0, height: 60 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' }
});

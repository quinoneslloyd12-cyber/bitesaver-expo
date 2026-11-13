import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PantryItem {
  id: string;
  name: string;
  quantity: string;
  shelf: string;
  category: 'produce' | 'proteins' | 'staples';
  daysLeft: number;
  estimatedValue: number;
}

export interface Expense {
  id: string;
  title: string;
  category: 'food' | 'coffee' | 'transport' | 'pantry' | 'school';
  amount: number;
  note: string;
  paymentMethod: string;
  dayGroup: 'today' | 'yesterday';
  timeLabel: string;
}

interface BiteSaverState {
  dailyLimit: number;
  monthlyAllowance: number;
  monthSpentBeforeToday: number;
  monthlyWasteSaved: number;
  rescueMealsEaten: number;
  cookSoonAlerts: boolean;
  dailyCheckIn: boolean;
  pantryItems: PantryItem[];
  expenses: Expense[];
  addExpense: (entry: Omit<Expense, 'id' | 'dayGroup' | 'timeLabel'>) => void;
  addPantryItem: (item: Omit<PantryItem, 'id'>) => void;
  consumePantryItem: (id: string) => void;
  completeRescueMeal: () => void;
  updateLimits: (dailyLimit: number, monthlyAllowance: number) => void;
  toggleSetting: (key: 'cookSoonAlerts' | 'dailyCheckIn') => void;
  resetAllData: () => Promise<void>;
}

const STORAGE_KEY = '@bitesaver_dorm_vault_v1';

const DEFAULT_PANTRY: PantryItem[] = [
  { id: 'p-1', name: 'Firm Tofu', quantity: '1 block (300g)', shelf: 'Fridge Shelf 1', category: 'proteins', daysLeft: 1, estimatedValue: 75 },
  { id: 'p-2', name: 'Baby Spinach', quantity: '1/2 bag', shelf: 'Crisper drawer', category: 'produce', daysLeft: 2, estimatedValue: 85 },
  { id: 'p-3', name: 'Eggs', quantity: '4 eggs remaining', shelf: 'Door tray', category: 'proteins', daysLeft: 2, estimatedValue: 80 },
  { id: 'p-4', name: 'Jasmine Rice', quantity: '~2 kg', shelf: 'Dry cabinet', category: 'staples', daysLeft: 60, estimatedValue: 120 },
  { id: 'p-5', name: 'Garlic & Onions', quantity: '5 heads', shelf: 'Counter basket', category: 'produce', daysLeft: 14, estimatedValue: 45 },
  { id: 'p-6', name: 'Soy Sauce & Calamansi', quantity: '3/4 bottle', shelf: 'Door condiment shelf', category: 'staples', daysLeft: 90, estimatedValue: 50 },
  { id: 'p-7', name: 'Rolled Oats', quantity: '500g', shelf: 'Mason jar shelf', category: 'staples', daysLeft: 45, estimatedValue: 95 },
  { id: 'p-8', name: 'Spring Onion', quantity: '1 small bunch', shelf: 'Crisper drawer', category: 'produce', daysLeft: 4, estimatedValue: 20 },
  { id: 'p-9', name: 'Day-old Rice', quantity: '2 bowls', shelf: 'Fridge Shelf 2', category: 'staples', daysLeft: 4, estimatedValue: 30 },
  { id: 'p-10', name: 'Butter', quantity: '1/3 stick', shelf: 'Door dairy bin', category: 'proteins', daysLeft: 18, estimatedValue: 40 },
  { id: 'p-11', name: 'Cooking Oil', quantity: '400ml', shelf: 'Counter rack', category: 'staples', daysLeft: 120, estimatedValue: 65 },
  { id: 'p-12', name: 'Roma Tomatoes', quantity: '3 pcs', shelf: 'Counter basket', category: 'produce', daysLeft: 5, estimatedValue: 35 },
];

const DEFAULT_EXPENSES: Expense[] = [
  { id: 'ex-1', title: 'Campus Canteen Lunch', category: 'food', amount: 95, note: 'Rice & Chicken Adobo', paymentMethod: 'Cash', dayGroup: 'today', timeLabel: '12:45 PM' },
  { id: 'ex-2', title: 'Iced Americano', category: 'coffee', amount: 63, note: 'Study fuel', paymentMethod: 'GCash', dayGroup: 'today', timeLabel: '10:15 AM' },
  { id: 'ex-3', title: 'Jeepney Fare to Dorm', category: 'transport', amount: 15, note: 'Commute back', paymentMethod: 'Coins', dayGroup: 'yesterday', timeLabel: '6:30 PM' },
  { id: 'ex-4', title: 'Sari-Sari Store Eggs & Tofu', category: 'pantry', amount: 85, note: 'Dorm pantry restock', paymentMethod: 'Cash', dayGroup: 'yesterday', timeLabel: '5:15 PM' },
];

const BiteSaverContext = createContext<BiteSaverState | null>(null);

export function BiteSaverProvider({ children }: { children: React.ReactNode }) {
  const [dailyLimit, setDailyLimit] = useState(300);
  const [monthlyAllowance, setMonthlyAllowance] = useState(9000);
  const [monthlyWasteSaved, setMonthlyWasteSaved] = useState(840);
  const [rescueMealsEaten, setRescueMealsEaten] = useState(14);
  const [cookSoonAlerts, setCookSoonAlerts] = useState(true);
  const [dailyCheckIn, setDailyCheckIn] = useState(true);
  const [pantryItems, setPantryItems] = useState<PantryItem[]>(DEFAULT_PANTRY);
  const [expenses, setExpenses] = useState<Expense[]>(DEFAULT_EXPENSES);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        if (parsed.dailyLimit) setDailyLimit(parsed.dailyLimit);
        if (parsed.monthlyAllowance) setMonthlyAllowance(parsed.monthlyAllowance);
        if (parsed.monthlyWasteSaved) setMonthlyWasteSaved(parsed.monthlyWasteSaved);
        if (parsed.rescueMealsEaten) setRescueMealsEaten(parsed.rescueMealsEaten);
        if (typeof parsed.cookSoonAlerts === 'boolean') setCookSoonAlerts(parsed.cookSoonAlerts);
        if (typeof parsed.dailyCheckIn === 'boolean') setDailyCheckIn(parsed.dailyCheckIn);
        if (Array.isArray(parsed.pantryItems)) setPantryItems(parsed.pantryItems);
        if (Array.isArray(parsed.expenses)) setExpenses(parsed.expenses);
      } catch {
        // Ignore malformed cache
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        dailyLimit,
        monthlyAllowance,
        monthlyWasteSaved,
        rescueMealsEaten,
        cookSoonAlerts,
        dailyCheckIn,
        pantryItems,
        expenses,
      })
    );
  }, [dailyLimit, monthlyAllowance, monthlyWasteSaved, rescueMealsEaten, cookSoonAlerts, dailyCheckIn, pantryItems, expenses]);

  const addExpense = (entry: Omit<Expense, 'id' | 'dayGroup' | 'timeLabel'>) => {
    const now = new Date();
    const timeLabel = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    setExpenses((prev) => [{ ...entry, id: `ex-${Date.now()}`, dayGroup: 'today', timeLabel }, ...prev]);
  };

  const addPantryItem = (item: Omit<PantryItem, 'id'>) => {
    setPantryItems((prev) => [{ ...item, id: `p-${Date.now()}` }, ...prev]);
  };

  const consumePantryItem = (id: string) => {
    setPantryItems((prev) => prev.filter((item) => item.id !== id));
    setMonthlyWasteSaved((v) => v + 35);
  };

  const completeRescueMeal = () => {
    setRescueMealsEaten((v) => v + 1);
    setMonthlyWasteSaved((v) => v + 85);
  };

  const updateLimits = (daily: number, monthly: number) => {
    setDailyLimit(daily);
    setMonthlyAllowance(monthly);
  };

  const toggleSetting = (key: 'cookSoonAlerts' | 'dailyCheckIn') => {
    if (key === 'cookSoonAlerts') setCookSoonAlerts((v) => !v);
    if (key === 'dailyCheckIn') setDailyCheckIn((v) => !v);
  };

  const resetAllData = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setDailyLimit(300);
    setMonthlyAllowance(9000);
    setMonthlyWasteSaved(840);
    setRescueMealsEaten(14);
    setPantryItems(DEFAULT_PANTRY);
    setExpenses(DEFAULT_EXPENSES);
  };

  return (
    <BiteSaverContext.Provider
      value={{
        dailyLimit,
        monthlyAllowance,
        monthSpentBeforeToday: 4122,
        monthlyWasteSaved,
        rescueMealsEaten,
        cookSoonAlerts,
        dailyCheckIn,
        pantryItems,
        expenses,
        addExpense,
        addPantryItem,
        consumePantryItem,
        completeRescueMeal,
        updateLimits,
        toggleSetting,
        resetAllData,
      }}
    >
      {children}
    </BiteSaverContext.Provider>
  );
}

export function useBiteSaver() {
  const ctx = useContext(BiteSaverContext);
  if (!ctx) throw new Error('useBiteSaver must be used inside BiteSaverProvider');
  return ctx;
}

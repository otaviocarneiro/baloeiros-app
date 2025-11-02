const supabase = require('../config/database');

class Event {
  static async create(eventData) {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  static async findAll() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async findCurrent() {
    const now = new Date();
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('date', now.toISOString())
      .order('date')
      .limit(1);
    
    if (error) throw error;
    return data[0];
  }

  static async update(id, updateData) {
    const { data, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  }
}

module.exports = Event;
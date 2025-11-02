const supabase = require('../config/database');

class Player {
  static async create(playerData) {
    const { data, error } = await supabase
      .from('players')
      .insert([playerData])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  static async findAll() {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async update(id, updateData) {
    const { data, error } = await supabase
      .from('players')
      .update(updateData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  static async delete(id) {
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  static async findByName(name) {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .ilike('name', `%${name}%`);
    
    if (error) throw error;
    return data;
  }
}

module.exports = Player;
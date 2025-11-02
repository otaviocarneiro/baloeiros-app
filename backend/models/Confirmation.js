const supabase = require('../config/database');

class Confirmation {
  static async create(confirmationData) {
    const { data, error } = await supabase
      .from('confirmations')
      .insert([confirmationData])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  static async findByEvent(eventId) {
    const { data, error } = await supabase
      .from('confirmations')
      .select(`
        *,
        players (*)
      `)
      .eq('event_id', eventId)
      .order('confirmed_at');
    
    if (error) throw error;
    return data;
  }

  static async findByPlayer(playerId, eventId) {
    const { data, error } = await supabase
      .from('confirmations')
      .select('*')
      .eq('player_id', playerId)
      .eq('event_id', eventId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async update(id, updateData) {
    const { data, error } = await supabase
      .from('confirmations')
      .update(updateData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  static async delete(id) {
    const { error } = await supabase
      .from('confirmations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  static async getConfirmedPlayers(eventId) {
    const { data, error } = await supabase
      .from('confirmations')
      .select(`
        players (*)
      `)
      .eq('event_id', eventId)
      .eq('status', 'confirmed')
      .order('confirmed_at');
    
    if (error) throw error;
    return data.map(item => item.players);
  }

  static async getWaitingList(eventId) {
    const { data, error } = await supabase
      .from('confirmations')
      .select(`
        *,
        players (*)
      `)
      .eq('event_id', eventId)
      .eq('status', 'waiting')
      .order('confirmed_at');
    
    if (error) throw error;
    return data;
  }
}

module.exports = Confirmation;
import base64
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'stored_models')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

import base64

# ... imports ...

@app.route('/api/models', methods=['GET'])
def list_models():
    """List all available models on the server."""
    files = []
    base_url = request.host_url.rstrip('/')
    
    for filename in os.listdir(UPLOAD_FOLDER):
        if filename.endswith('.json'):
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            try:
                with open(filepath, 'r') as f:
                    data = json.load(f)
                    model_name = data.get('name', filename[:-5])
                    voxel_count = data.get('voxel_count', len(data.get('data', [])))
                    
                    # Check if thumbnail exists
                    thumb_filename = filename.replace('.json', '.png')
                    thumb_path = os.path.join(UPLOAD_FOLDER, thumb_filename)
                    thumb_url = None
                    if os.path.exists(thumb_path):
                        thumb_url = f"/api/models/thumbnail/{thumb_filename}"
                        
                    files.append({
                        'id': filename,
                        'name': model_name,
                        'voxel_count': voxel_count,
                        'thumbnail': thumb_url,
                        'timestamp': os.path.getmtime(filepath)
                    })
            except Exception as e:
                print(f"Error reading {filename}: {e}")
                
    files.sort(key=lambda x: x['timestamp'], reverse=True)
    return jsonify(files)

@app.route('/api/models', methods=['POST'])
def upload_model():
    """Upload a new model."""
    if not request.json:
        return jsonify({'error': 'No JSON data provided'}), 400
    
    data = request.json
    name = data.get('name', 'Untitled')
    voxel_data = data.get('data')
    thumbnail_b64 = data.get('thumbnail') # Base64 string
    
    if not voxel_data:
        return jsonify({'error': 'No voxel data provided'}), 400

    safe_name = "".join([c for c in name if c.isalpha() or c.isdigit() or c==' ']).rstrip()
    if not safe_name:
        safe_name = "model"
    
    timestamp = int(time.time())
    filename = f"{safe_name}_{timestamp}.json"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    
    # Save Thumbnail
    if thumbnail_b64:
        try:
            # defined as data:image/png;base64,.....
            if ',' in thumbnail_b64:
                header, encoded = thumbnail_b64.split(',', 1)
                data_bytes = base64.b64decode(encoded)
                thumb_filename = f"{safe_name}_{timestamp}.png"
                with open(os.path.join(UPLOAD_FOLDER, thumb_filename), 'wb') as f:
                    f.write(data_bytes)
        except Exception as e:
            print(f"Failed to save thumbnail: {e}")

    model_obj = {
        'name': name,
        'data': voxel_data,
        'voxel_count': len(voxel_data),
        'created_at': timestamp
    }
    
    with open(filepath, 'w') as f:
        json.dump(model_obj, f)
        
    return jsonify({'success': True, 'id': filename, 'message': 'Model uploaded successfully'})

@app.route('/api/models/thumbnail/<filename>')
def get_thumbnail(filename):
    """Serve thumbnail image."""
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/api/models/<model_id>', methods=['GET'])
def get_model(model_id):
    """Get a specific model by ID (filename)."""
    safe_id = os.path.basename(model_id) # Basic security
    filepath = os.path.join(UPLOAD_FOLDER, safe_id)
    
    if not os.path.exists(filepath):
        return jsonify({'error': 'Model not found'}), 404
        
    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/models/<model_id>', methods=['DELETE'])
def delete_model(model_id):
    """Delete a model and its thumbnail."""
    safe_id = os.path.basename(model_id)
    filepath = os.path.join(UPLOAD_FOLDER, safe_id)
    
    if not os.path.exists(filepath):
        return jsonify({'error': 'Model not found'}), 404
        
    try:
        os.remove(filepath)
        
        # Try to remove thumbnail
        thumb_filename = safe_id.replace('.json', '.png')
        thumb_path = os.path.join(UPLOAD_FOLDER, thumb_filename)
        if os.path.exists(thumb_path):
            os.remove(thumb_path)
            
        return jsonify({'success': True, 'message': 'Model deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5002, host='0.0.0.0')

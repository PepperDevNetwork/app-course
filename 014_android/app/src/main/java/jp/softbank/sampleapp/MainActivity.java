package jp.softbank.sampleapp;

import android.content.Context;
import android.content.Intent;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Handler;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.aldebaran.qi.AnyObject;
import com.aldebaran.qi.Future;
import com.aldebaran.qi.Session;

import java.util.List;


public class MainActivity extends AppCompatActivity implements SensorEventListener {

    private SensorManager mManager = null;
    private Session mSession = null;
    private Button mButtonStart = null;
    private Button mButtonStop = null;
    private AnyObject mALMemory = null;
    private EditText mEditText = null;
    private Handler mHandler = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mHandler = new Handler();

        mManager = (SensorManager)getSystemService(SENSOR_SERVICE);
        mButtonStart = (Button)findViewById(R.id.btn_start);
        mButtonStop = (Button)findViewById(R.id.btn_stop);
        mEditText = ((EditText)findViewById(R.id.text_ip));


        mButtonStart.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                start();
            }
        });

        mButtonStop.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(mButtonStop.isEnabled()) {
                    mButtonStop.setEnabled(false);
                    if(mSession != null) {
                        if(mSession.isConnected()) {
                            mSession.close();
                        }else{
                            stop();
                        }
                    }
                }
            }
        });
    }

    private void start(){
        if(mButtonStart.isEnabled()){
            mHandler.post(new Runnable() {
                @Override
                public void run() {
                    mEditText.setEnabled(false);
                    mButtonStart.setEnabled(false);
                    mButtonStop.setEnabled(true);
                }
            });

            String ip = mEditText.getText().toString();
            mSession = new Session();
            mSession.addConnectionListener(new Session.ConnectionListener() {
                @Override
                public void onConnected() {
                    try {
                        Future<AnyObject> any = mSession.service("ALMemory");
                        mALMemory = (AnyObject) any.get();
                        mALMemory.call("raiseEvent", "ComSoftbankrobotics/SampleProject/Phone/Connected", 1 );
                        mHandler.post(new Runnable() {
                            @Override
                            public void run() {
                                Toast.makeText(getApplicationContext(), getResources().getString(R.string.toast_success), Toast.LENGTH_SHORT).show();
                            }
                        });
                    }catch(Exception e){
                        mSession.close();
                    }
                }
                @Override
                public void onDisconnected(String s) {
                    stop();
                }
            });
            mSession.connect(ip);
        }
    }

    private void stop(){
        mSession = null;
        mALMemory = null;
        mHandler.post(new Runnable() {
            @Override
            public void run() {
                mEditText.setEnabled(true);
                mButtonStart.setEnabled(true);
                mButtonStop.setEnabled(false);
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();

        List<Sensor> sensors = mManager.getSensorList(Sensor.TYPE_ACCELEROMETER);
        if(sensors.size() > 0) {
            Sensor sr = sensors.get(0);
            mManager.registerListener(this, sr, SensorManager.SENSOR_DELAY_UI);
        }
    }

    @Override
    protected void onStop() {
        super.onStop();
        mManager.unregisterListener(this);
    }

    @Override
    public void onDestroy(){
        super.onDestroy();
        if(mSession != null){
            mSession.close();
        }
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if(mALMemory != null && event.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {
            String value = String.format("%f,%f,%f" , event.values[0], event.values[1], event.values[2]);
            mALMemory.call("raiseEvent", "ComSoftbankrobotics/SampleProject/Phone/Sensor", value );
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
        // nop
    }
}
